# AUDIT-REPORT.md — Deep Verification Report

Date: 2026-09-08
Method: I re-read every audit claim against the actual code, the built output, and live behaviour (unit tests + static-serve smoke test). This report lists **VERIFIED**, **NEW FINDINGS**, and **any wrong claims**.

**Bottom line: every claim in AUDIT-REPORT.md holds, and all 7 fixes work. No audit claim was found to be incorrect.** One prior test needed a corrected expectation (see §2.2 — the code was right, my test was wrong).

---

## 1. Result summary

| Area | Verdict | Evidence |
|---|---|---|
| SEO fixes | VERIFIED | head tags, valid JSON-LD, real 1200×630 PNG, robots/sitemap/favicon all serve 200 |
| Backend fixes | VERIFIED | rate limiter passes 15/15 unit tests; dimension caps verified; compiles |
| Frontend security | VERIFIED | no runtime XSS/cookies/eval; typecheck + build pass |
| Build/deploy readiness | VERIFIED | `dist/public` frozen fresh; all static assets + hashed JS/CSS serve correctly |
| Supply-chain | ⚠ NEW | `pnpm audit`: 11 vulns — but **all in dev/build tooling or the unused Express scaffold**, none in the deployed runtime |
| git hygiene | VERIFIED | no secrets/env tracked; working tree clean |

---

## 2. Per-claim verification

### 2.1 SEO (AUDIT-REPORT.md §2 + the 7 fixes)

| Claim | Result | Evidence |
|---|---|---|
| title / meta description (150 chars) | ✅ | title correct; description = **150 chars** (verified programmatically) |
| viewport, robots index/follow, og:, twitter:, canonical, favicon link | ✅ | all present in `index.html` (og:title/desc/type/image/url; twitter:title/desc/image/card; canonical) |
| JSON-LD SoftwareApplication | ✅ | parses as valid JSON; type=SoftwareApplication, category=MultimediaApplication, os=Any, offer price=0 USD, featureList=10 entries |
| og-image.png exists | ✅ | valid PNG, RGB, **1200×630**, 53,204 bytes, served over HTTP 200 |
| robots.txt + sitemap.xml | ✅ | both present + served; `Allow: /` + Sitemap line; sitemap has single homepage `<loc>` |
| favicon.svg | ✅ | 64×64, dark `#11141a` bg, gold/cyan shapes |
| Inter font `<link>` removed | ✅ | absent from source AND built `dist/public/index.html` |
| h1 present | ✅ | real `<h1>` at `cleaner-workspace.tsx:696` (one h1 per rendered route) |
| dist contains all new SEO | ✅ | `dist/public`: index.html (JSON-LD present), og-image.png, robots.txt, sitemap.xml, favicon.svg, hashed assets |
| No source maps shipped | ✅ | no `.map` references in built html/assets dir |

### 2.2 Backend (AUDIT-REPORT.md §3.2 + the 7 fixes)

| Claim | Result | Evidence |
|---|---|---|
| Per-IP rate limit, 10/min/endpoint | ✅ | **unit-tested by importing `main.py`**: 11th request → 429; different IP allowed; different endpoint = separate bucket; unblocked after window; `x-forwarded-for` first-IP used; expired buckets pruned (memory bounded) |
| Dimension cap (8000px / 60MP) | ✅ | 8001px side rejected; 8000×8000 (64MP) rejected via pixel rule; 8000×7500 (60MP exact) & 5000×5000 accepted; correct `Image`/`Mask` error labels |
| Depends wired to both heavy endpoints | ✅ | `Depends(rate_limit)` present on `/api/inpaint` and `/api/remove-background` only |
| Backend compiles | ✅ | `python -m py_compile` OK; valid UTF-8 (em-dash bytes `\xe2\x80\x94` — the `�` seen in console output is a Windows terminal rendering artifact, not a file problem) |
| Frontend handles 429/413 errors | ✅ | strips `error`/`detail` from API body into friendly messages → rate-limit message shows in UI |
| requirements.txt | ✅ | no new dependency introduced (used in-memory token bucket instead of slowapi) → no entry needed |

> **Correction to my own earlier test (not a code bug):** a 9000×9000 image is rejected by the **8000px rule first** (right behaviour), which is why my first unit-test expectation printed the wrong message. Re-confirmed the pixel rule with 8000×8000 → correctly rejected. Code is correct.

### 2.3 Frontend security (AUDIT-REPORT.md §3.1)

| Claim | Result | Evidence |
|---|---|---|
| No XSS (no dangerouslySetInnerHTML at runtime) | ✅ | grep found only 1 occurrence — `chart.tsx:78`, a **static CSS injection from developer config**, and `chart.tsx` is **never imported by the app** (self-referential only) |
| No cookies at runtime | ✅ | only `document.cookie` write is `sidebar.tsx:85` (`sidebar_state` UI flag) — `<SidebarProvider>`/`Sidebar` are **never rendered** anywhere → unreachable dead code |
| No localStorage/sessionStorage/eval/new Function | ✅ | zero matches in `src/` |
| Object-URL hygiene, blob-only image flow, client+server validation | ✅ | verified in code (revokeObjectURL in all editors; ACCEPTED_TYPES + 15MB both sides) |
| API contract alignment | ✅ | generated `HealthStatus {status:string}` ↔ backend `{"status":"ok"}`; `ErrorResponse {error:string}` + `detail` fallback handled in frontend |
| Secrets / tracked env | ✅ | `git ls-files` → no env/secret/key/token/credential files; no `.env` in workspace; working tree clean |

### 2.4 Build & deploy (AUDIT-REPORT.md §2.2 + the 7 fixes)

| Claim | Result | Evidence |
|---|---|---|
| Production build succeeds | ✅ | `vite build` OK (13.4s); only a benign sourcemap warning from the runtime-error-overlay tooling |
| Built site actually serves | ✅ | local static-serve smoke test: `/`, `/robots.txt`, `/sitemap.xml`, `/og-image.png`, `/favicon.svg`, `/assets/index-*.js`, `/assets/index-*.css` → **all HTTP 200** |
| typecheck passes | ✅ | `pnpm --filter @workspace/ai-image-cleaner run typecheck` → clean |

---

## 3. NEW findings from this deep pass (not in the original report)

| # | Severity | Finding | Recommendation |
|---|---|---|---|
| N1 | Info | **`pnpm audit` → 11 vulns (8 high, 2 mod, 1 low), but NONE reach the deployed app.** All are inside: `orval` codegen (fast-uri, brace-expansion, js-yaml — dev-only, `lib/api-spec`), `vite/postcss` build tooling (nanoid), `esbuild` (low; dev-server-only, Windows), and `qs` via `express/body-parser` — which lives only in the **unused legacy Express scaffold** (`artifacts/api-server/src`); production serves the **Python FastAPI** backend | Run `pnpm audit fix`; bump `orval`/`vite`; optionally delete the unused Express scaffold + its `@workspace/db`/`cors`/`express` deps to shrink the attack/supply surface |
| N2 | Low | `og:image` / `twitter:image` use a relative path `/og-image.png` | Works once deployed (crawlers resolve against `og:url`/canonical = `example.com`). Convert to an absolute URL (`https://<domain>/og-image.png`) when the real domain is set |
| N3 | Info | Replit SPA rewrite (`/* → /index.html`) | Static files should win over rewrites, but this can only be confirmed **after** deploy with `curl -I /robots.txt`. Keep on the deploy checklist |
| N4 | Info | `requirements.txt` is unpinned (`fastapi`, `uvicorn`, …) | Deterministic deploys prefer `==` pins or `uv.lock`-style locking; the repo already has `uv.lock` at root — consider using it for the backend env |
| N5 | Info | Bundle bloat: ~300 unused shadcn/ui components are present on disk (`breadcrumb`, `chart`, `sidebar`, `calendar`, …); tree-shaking keeps them mostly out of the bundle, but unused deps remain in `package.json` (recharts, framer-motion, react-icons, vaul, cmdk, …) | Optional cleanup; not a vulnerability. Bundle is 402 KB JS / 124 KB gzip — fine for this app |
| N6 | Info | Windows console shows `�` for the em-dash in error strings during CLI testing | Cosmetic only — files are correct UTF-8, and FastAPI returns proper UTF-8 |

---

## 4. Files verified (evidence locations)
- `artifacts/ai-image-cleaner/index.html` (head + JSON-LD)
- `artifacts/ai-image-cleaner/public/og-image.png`, `robots.txt`, `sitemap.xml`, `favicon.svg`
- `artifacts/ai-image-cleaner/dist/public/**` (fresh build output)
- `artifacts/ai-image-cleaner/src/components/cleaner-workspace.tsx`, `additional-tools.tsx`, `ui/chart.tsx`, `ui/sidebar.tsx`, `pages/not-found.tsx`
- `artifacts/api-server/backend/main.py`
- `lib/api-client-react/src/generated/api.schemas.ts`, `custom-fetch.ts`
- Root `replit.md`, `.gitignore`, git index

## 5. Tools used for verification
- `python -m py_compile`, unit-test harness importing `main.py` (rate limiter + dimension caps)
- PIL byte/format validation of og-image; JSON parse of JSON-LD; regex checks of head
- `pnpm audit`, `pnpm --filter ... run build`, `pnpm --filter ... run typecheck`
- Local `http.server` smoke test of `dist/public`