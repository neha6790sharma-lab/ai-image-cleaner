import io
import os
import threading
import time
from collections import deque

import cv2
import numpy as np
from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.concurrency import run_in_threadpool

try:
    from rembg import remove as _remove_background
    _REMBG_AVAILABLE = True
except Exception:
    # rembg is optional at import time so the rest of the service still boots
    # even when the dependency (or its ONNX runtime) is not installed yet.
    _remove_background = None
    _REMBG_AVAILABLE = False

MAX_IMAGE_BYTES = 15 * 1024 * 1024
MAX_IMAGE_DIMENSION = 8000
MAX_IMAGE_PIXELS = 60_000_000
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

RATE_LIMIT_PER_MINUTE = 10
RATE_LIMIT_WINDOW_SECONDS = 60.0
_rate_events: dict[tuple[str, str], deque] = {}
_rate_lock = threading.Lock()

app = FastAPI(title="AI Image Cleaner API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def error(message: str, status_code: int) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"error": message})


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _prune_rate_events(now: float) -> None:
    expired = [
        key for key, hits in _rate_events.items()
        if (now - hits[-1]) > RATE_LIMIT_WINDOW_SECONDS
    ]
    for key in expired:
        _rate_events.pop(key, None)


def rate_limit(request: Request) -> None:
    """Simple in-memory token bucket: 10 requests/minute per IP per endpoint."""
    key = (_client_ip(request), request.url.path)
    now = time.monotonic()
    with _rate_lock:
        _prune_rate_events(now)
        hits = _rate_events.setdefault(key, deque())
        cutoff = now - RATE_LIMIT_WINDOW_SECONDS
        while hits and hits[0] <= cutoff:
            hits.popleft()
        if len(hits) >= RATE_LIMIT_PER_MINUTE:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a moment and try again.",
            )
        hits.append(now)


def check_image_dimensions(image_array: np.ndarray, label: str) -> str | None:
    """Reject decompression-bombs by capping decoded width/height and pixels."""
    height, width = image_array.shape[:2]
    if width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
        return f"{label} bohat bada hai — width/height 8000px se zyada nahi honi chahiye."
    if width * height > MAX_IMAGE_PIXELS:
        return f"{label} ke pixels bahut zyada hain. Chhoti image use karein."
    return None


async def read_upload(upload: UploadFile, label: str) -> bytes | None:
    if upload.content_type not in ALLOWED_TYPES:
        return None
    data = await upload.read()
    if len(data) > MAX_IMAGE_BYTES:
        return None
    return data


@app.get("/api/health")
@app.get("/api/healthz")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/inpaint")
async def inpaint(image: UploadFile, mask: UploadFile, _rate: None = Depends(rate_limit)):
    if image.content_type not in ALLOWED_TYPES:
        return error("Image file type not supported. JPG, PNG ya WEBP upload karein.", 400)
    if mask.content_type not in ALLOWED_TYPES:
        return error("Mask file valid nahi hai. Please try the selection again.", 400)

    image_bytes = await read_upload(image, "image")
    mask_bytes = await read_upload(mask, "mask")
    if image_bytes is None or mask_bytes is None:
        return error("File 15MB se chhoti honi chahiye.", 413)

    image_array = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
    mask_array = cv2.imdecode(np.frombuffer(mask_bytes, dtype=np.uint8), cv2.IMREAD_GRAYSCALE)
    if image_array is None or mask_array is None:
        return error("Image ya mask read nahi ho paaya. Please try another file.", 400)

    dim_error = check_image_dimensions(image_array, "Image")
    if dim_error:
        return error(dim_error, 400)
    dim_error = check_image_dimensions(mask_array, "Mask")
    if dim_error:
        return error(dim_error, 400)

    height, width = image_array.shape[:2]
    if mask_array.shape[:2] != (height, width):
        mask_array = cv2.resize(mask_array, (width, height), interpolation=cv2.INTER_NEAREST)

    _, clean_mask = cv2.threshold(mask_array, 127, 255, cv2.THRESH_BINARY)
    if not np.any(clean_mask):
        return error("Pehle image par remove karne wala area paint karein.", 400)

    try:
        result = cv2.inpaint(image_array, clean_mask, 7, cv2.INPAINT_TELEA)
        success, encoded = cv2.imencode(".png", result)
    except cv2.error:
        return error("Processing fail ho gayi. Please try a smaller image or selection.", 500)

    if not success:
        return error("PNG export nahi ho paaya. Please try again.", 500)
    return StreamingResponse(
        io.BytesIO(encoded.tobytes()),
        media_type="image/png",
        headers={"Cache-Control": "no-store"},
    )


@app.post("/api/remove-background")
async def remove_background(image: UploadFile, _rate: None = Depends(rate_limit)):
    """Strip the background with rembg (local ONNX model, no API key, free).

    The heavier CPU work is offloaded to a worker thread via
    ``run_in_threadpool`` so it never blocks the event loop, and everything
    stays in memory — no file is written to disk.
    """
    if image.content_type not in ALLOWED_TYPES:
        return error("Image file type not supported. JPG, PNG ya WEBP upload karein.", 400)
    data = await image.read()
    if len(data) > MAX_IMAGE_BYTES:
        return error("File 15MB se chhoti honi chahiye.", 413)
    if not _REMBG_AVAILABLE or _remove_background is None:
        return error("Background removal service is not installed on this server.", 503)

    preview = cv2.imdecode(np.frombuffer(data, dtype=np.uint8), cv2.IMREAD_COLOR)
    if preview is None:
        return error("Image read nahi ho paaya. Please try another file.", 400)
    dim_error = check_image_dimensions(preview, "Image")
    if dim_error:
        return error(dim_error, 400)

    try:
        output = await run_in_threadpool(_remove_background, data)
        buffer = io.BytesIO()
        output.save(buffer, format="PNG")
    except Exception:
        return error("Background removal fail ho gayi. Please try a smaller image.", 500)

    return StreamingResponse(
        io.BytesIO(buffer.getvalue()),
        media_type="image/png",
        headers={"Cache-Control": "no-store"},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))