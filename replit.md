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

- `artifacts/ai-image-cleaner/src/components/cleaner-workspace.tsx` — upload flow and all four editor experiences
- `artifacts/ai-image-cleaner/src/index.css` — shared dark workshop theme and responsive styling
- `artifacts/api-server/backend/main.py` — in-memory FastAPI health and OpenCV inpaint endpoints
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Client-side tools never upload image bytes; only object removal calls the local API.
- The remove-object editor maintains a full-resolution white mask in memory and posts it as multipart form data.
- The API service is FastAPI so the inpaint algorithm directly uses OpenCV's TELEA implementation.
- The app intentionally has no accounts, database records, or permanent file storage.

## Product

- Accepts JPG, PNG, and WEBP images up to 15MB.
- Provides mask-based object removal, interactive crop, format conversion, and exact-pixel Indian document photo presets.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
