# AI Image Cleaner

AI Image Cleaner is a privacy-first image utility for removing unwanted areas, cropping, converting formats, and generating Indian document photos without accounts or permanent file storage.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the FastAPI image-processing service
- `pnpm --filter @workspace/ai-image-cleaner run dev` — run the Vite web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The API service uses the workspace's Python 3.11 environment and keeps image bytes in memory only.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Python FastAPI + Uvicorn
- Image processing: OpenCV, Pillow, NumPy
- Frontend: React + Vite + TypeScript
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ai-image-cleaner/src/components/cleaner-workspace.tsx` — upload flow and all ten editor experiences
- `artifacts/ai-image-cleaner/src/components/additional-tools.tsx` — rotate, adjust, compress, watermark, privacy, and background editor experiences
- `artifacts/ai-image-cleaner/src/index.css` — shared dark workshop theme and responsive styling
- `artifacts/api-server/backend/main.py` — in-memory FastAPI health and OpenCV inpaint endpoints
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Ten focused tools: Remove Object, Crop, Convert Format, Passport Size, Rotate/Flip, Adjust & Filters, Compress Image, Watermark/Add Text, Remove Privacy Data, and Background Remover.
- Client-side tools never upload image bytes; only Remove Object and Background Remover call the local API service.
- The remove-object editor maintains a full-resolution white mask in memory and posts it as multipart form data.
- The API service is FastAPI so the inpaint algorithm directly uses OpenCV's TELEA implementation.
- The API enforces a 15MB file cap, an 8000px/vs60MP decoded-dimension cap, and a 10-request-per-minute per-IP rate limit on the two image endpoints.
- The app intentionally has no accounts, database records, or permanent file storage.

## Product

- Accepts JPG, PNG, and WEBP images up to 15MB.
- Provides mask-based object removal, interactive crop, format conversion, Indian document photo presets (passport/visa/PAN/stamp), rotate & flip, brightness/contrast/saturation plus B&W and sepia filters, JPG compression with resizing, watermark text overlay, EXIF/GPS metadata stripping, and AI background removal — all from one upload.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
