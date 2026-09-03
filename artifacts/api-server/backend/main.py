import io
import os

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile
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
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

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
async def inpaint(image: UploadFile, mask: UploadFile):
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
async def remove_background(image: UploadFile):
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