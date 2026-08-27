---
name: FastAPI multipart image processing
description: Browser file uploads are handled by a dedicated FastAPI service and kept in memory.
---

The image-cleaning backend accepts the original image and a painted mask as multipart uploads, validates MIME types and size before decoding, and returns only an in-memory PNG result.

**Why:** OpenAPI code generation in the shared Node-oriented libraries cannot type browser `File` and `Blob` values without DOM libs, so the frontend uses a direct `FormData` request for this endpoint while health remains generated.

**How to apply:** Keep image-processing inputs as multipart `UploadFile` fields, preserve the 15MB limit, and do not add disk or database persistence for image bytes.