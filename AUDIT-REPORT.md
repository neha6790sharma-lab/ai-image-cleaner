# AI Image Cleaner — Security, Missing-Feature & SEO Audit Report

Date: 2026-09-08
Scope: Full app — frontend (`artifacts/ai-image-cleaner`), API service (`artifacts/api-server`), workspace config.
Status line: Typecheck passes. No security-critical vulnerability found in the frontend. SEO meta is in place but has a few gaps that must be closed before/after deploy.

---

## 1. Summary

| Area | Verdict | Notes |
|---|---|---|
| Security (frontend) | Good | No XSS, no secrets, no remote image loading, object URLs cleaned up |
| Security (API) | Fair | Missing rate limiting + decompression-bomb protection on heavy AI endpoints |
| SEO | Good, one gap | All core tags present; **og-image.png file does not exist** and **dist build is stale** |
| Functionality | Complete | All 10 advertised tools implemented and wired up |
| Quality | Minor issues | 404 page breaks dark theme, doc drift, small a11y gaps |

---

## 2. SEO Audit

### 2.1 Already in place (from previous change)
- Descriptive `<title>` — "cleaner. — Free Online Image Editor: Remove Objects, Crop, Compress & More"
- `<meta name="description">` (150 chars — under the 160 cap)
- `<meta name="viewport">` — already present
- Open Graph: `og:title`, `og:description`, `og:type="website"`, `og:image`, `og:url`
- Twitter: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`
- `<link rel="canonical">`
- Favicon linked + custom `public/favicon.svg` (dark theme, gold/cyan)
- `public/robots.txt` (allow all + Sitemap) and `public/sitemap.xml`
- Main heading is a real `<h1>` (`cleaner-workspace.tsx:696`)
- `<html lang="en">`, `robots: index, follow`

### 2.2 Gaps — must fix

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| 1 | **High** | `og.image` / `twitter:image` point to `/og-image.png` but **the file does not exist** → share previews will 404 | Create `artifacts/ai-image-cleaner/public/og-image.png` (1200×630, dark theme, 1–2 tools preview + logo). Also confirm it gets deployed |
| 2 | **High** | Production serves `dist/public` (`artifact.toml`), and `dist/public/index.html` is **stale** — it still has the old "AI Image Cleaner / built on Replit" meta | Run `pnpm --filter @workspace/ai-image-cleaner run build` before deploying so the new meta, robots.txt and sitemap go live |
| 3 | **Medium** | `canonical`, `og:url`, `robots.txt`, `sitemap.xml` all use placeholder `https://example.com` | Replace with the real domain once deployed (deploy first, then update and rebuild) |
| 4 | Low | No JSON-LD structured data | Add `SoftwareApplication` / `WebApplication` schema (name, headline tools, offers.price=0, offline-capable) — biggest remaining SEO win |
| 5 | Low | Missing `og:site_name`, `og:locale`, `og:image:width/height` | Optional, cheap to add |
| 6 | Low | Missing `<meta name="theme-color">` | Matches dark theme; improves mobile browser chrome |
| 7 | Low-compat | `favicon.svg` only — no PNG fallback for older Safari/IE paths | Optional; modern browsers are fine |
| 8 | Verify | `artifact.toml` rewrite `/* → /index.html` could shadow `/robots.txt` & `/sitemap.xml` | Replit serves existing static files before rewrites, so normally fine — verify with `curl /robots.txt` after deploy |

### 2.3 Performance note (not SEO-correctness)
- `index.html` loads the Inter font via `<link>`, but the app actually uses **Space Grotesk + DM Mono** (loaded via CSS `@import`). The Inter request is dead weight. Removing it cuts one render-blocking request.
- Fonts load via `@import` in `index.css` (blocking). Move to preconnect + preload for LCP gains. Optional.

---

## 3. Security Audit

### 3.1 Frontend — good findings
- **No XSS.** React escapes all text; no `dangerouslySetInnerHTML` anywhere. Watermark text is drawn to a canvas, not inserted as HTML.
- **No secrets/keys/tokens** in the codebase (grep for api_key/secret/token/Authorization — zero hits). No `.env` files.
- **No remote image loading.** `loadImage()` only reads blob URLs created from the user's file; `<img>` sources are all blob URLs.
- **Memory hygiene.** `URL.createObjectURL` results are revoked on unmount/reset (workspace + rotate/background/privacy editors).
- **File validation.** Type whitelist (JPG/PNG/WEBP) + 15 MB cap enforced client-side (`MAX_FILE_SIZE`, `ACCEPTED_TYPES`) and re-validated server-side.
- **Error handling.** Friendly fallbacks; internal details only in DEV via `ErrorBoundary` (`import.meta.env.DEV` guard) — hidden in production.
- **No accounts/cookies/storage.** Nothing to steal, no CSRF surface.
- **Downloads** use object URLs with `anchor.download` — no navigation to attacker URLs.

### 3.2 API service (`artifacts/api-server/backend/main.py`) — findings

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| 1 | **Medium-High** | **No rate limiting / auth / abuse protection** on `/api/inpaint` and `/api/remove-background` — both are heavy (OpenCV inpaint, ONNX rembg) and publicly reachable. Easy DoS by spamming requests; rembg model re-loads per request | Add in-memory rate limiting (e.g. `slowapi`/`limits`, per-IP token bucket) + request queue; enforce a max concurrent jobs limit; optionally require a lightweight signed token |
| 2 | Medium | **Decompression-bomb risk.** A small 15 MB PNG can declare huge pixel dimensions and exhaust server RAM during `cv2.imdecode` / rembg | Cap decoded dimensions (e.g. width/height ≤ 8000px and/or total pixels) and check `imdecode` output shape before processing |
| 3 | Low-Medium | `content-type` header is client-supplied and spoofable — validation relies on it, then on `imdecode` returning `None` for garbage. No magic-byte verification | Good enough today (imdecode rejects garbage), but add a magic-byte check (PNG signature / JPEG FFD8 / WEBP RIFF) for defense-in-depth |
| 4 | Low | `CORSMiddleware(allow_origins=["*"], allow_credentials=False)` | Acceptable now (no cookies). Never set `allow_credentials=True` with `*`; lock down if auth is ever added |
| 5 | Info | `read_upload` reads full body into memory (`upload.read()`) — fine for 15 MB cap | Consider streaming + content-length check; not urgent |
| 6 | Info | Legacy **Express scaffold** (`artifacts/api-server/src`) exists but is unused in production (FastAPI runs). It has `cors()` wide open and `db`/zod deps unused | No action needed, but consider deleting to reduce supply-chain surface & confusion |

### 3.3 Security headers (hosting-level)
- No `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` configured for the static host.
- Mitigating factors: no cookies, no remote images, no inline scripts in the built output, blob-only data flow.
- Recommendation: add a basic CSP (`default-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'`) + the other headers on the host.

### 3.4 Dependencies
- Supply-chain scan not run (no network). Run `pnpm audit` before release.
- All frontend deps live under `devDependencies` (build-time) — unusual but functional.

---

## 4. Functionality / Missing-Feature Audit

### 4.1 All 10 advertised tools are present and wired to real editors
Remove Object (inpaint), Crop, Convert Format, Passport Size, Rotate/Flip, Adjust & Filters, Compress, Watermark/Add Text, Remove Privacy Data, Background Remover — all implemented (`cleaner-workspace.tsx` + `additional-tools.tsx`). Typecheck passes.

### 4.2 Inconsistencies & minor gaps

| # | Severity | Issue | Note |
|---|---|---|---|
| 1 | Low | **Two different export flows.** Crop/Convert/Passport/Remove use the unified "Export ready → Before/After slider" result screen. Rotate/Adjust/Compress/Watermark/Privacy/Background download directly from the tool, no unified result view | Not a bug, but inconsistent UX. Optional: unify to one result flow |
| 2 | Low | Result download name is generic (`cleaner-export.jpg`) while tool-specific exports keep base filename (`name-compressed.jpg`) | Minor polish |
| 3 | Low | **404 page is light themed** (`bg-gray-50`, `text-gray-900`) — visually breaks the dark app | Restyle to the dark `cleaner` theme |
| 4 | Very Low | Dead/unreachable fallback in `renderTool()` (`return <PassportEditor …>` for unmatched tool) | In practice never hit; harmless |
| 5 | Low | **Doc drift** — `replit.md` says "only object removal calls the local API" and "four editor experiences", but Background Remover also calls the API and there are 10 tools | Update `replit.md` |
| 6 | Low | A11y: upload zone is a clickable `div` (no `role="button"`/keyboard support); color input lacks an aria-label; `maximum-scale=1` viewport blocks pinch-zoom | Medium impact only for accessibility-focused users |
| 7 | Info | Privacy tool strips EXIF/GPS by canvas re-encode → works, exports PNG | Documented in UI correctly |
| 8 | Info | Compress always exports JPG (stated in UI) | By design |

---

## 5. Priority Action List (recommended order)

1. **Create `public/og-image.png`** (1200×630) so share previews work. (High, 5 min)
2. **Run the frontend build** so the new SEO ships to `dist/public`. (High)
3. **Deploy**, then replace `example.com` placeholders everywhere and rebuild. (High)
4. **Add JSON-LD structured data** (SoftwareApplication) to `index.html`. (Medium)
5. **API hardening:** max-dimension cap + rate limiting on `/api/remove-background` & `/api/inpaint`. (Medium-High)
6. **Hosting headers:** CSP + `X-Content-Type-Options` + `Referrer-Policy`. (Medium)
7. Restyle 404 page, remove unused Inter font link, update `replit.md`. (Low)
8. Run `pnpm audit` before release. (Medium)

---

## 6. Files reviewed
- `artifacts/ai-image-cleaner/index.html`
- `artifacts/ai-image-cleaner/public/robots.txt`, `public/sitemap.xml`, `public/favicon.svg`
- `artifacts/ai-image-cleaner/src/main.tsx`, `App.tsx`, `index.css`, `error-boundary.tsx`
- `artifacts/ai-image-cleaner/src/components/cleaner-workspace.tsx`, `additional-tools.tsx`
- `artifacts/ai-image-cleaner/src/pages/home.tsx`, `not-found.tsx`
- `artifacts/ai-image-cleaner/vite.config.ts`, `package.json`, `.replit-artifact/artifact.toml`
- `artifacts/api-server/backend/main.py`, `src/*`, `package.json`
- `lib/api-client-react/src/*`
- Root: `package.json`, `.gitignore`, `.replit`, `replit.md`, `main.py`