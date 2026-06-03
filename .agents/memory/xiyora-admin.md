---
name: XIYORA Admin Panel
description: Key decisions and non-obvious constraints for the /xiyora-admin panel, product DB, image uploads, and Cloudflare integration.
---

# XIYORA Admin Panel

## Auth — fail-closed
`adminAuth.ts` throws if `ADMIN_SECRET` is missing — no hardcoded fallback allowed. JWT signed with this secret; token stored in `localStorage` as `xiyora_admin_token`. Also accepts legacy `x-admin-secret` header for backward compat.

**Why:** A hardcoded fallback would allow token forgery in any misconfigured environment.

## Admin panel renders fullscreen
`App.tsx` early-returns `<AdminPanel/>` wrapped in `ThemeCtx.Provider` before the public nav/footer tree when `page==="xiyora-admin"`. The `renderView()` switch also has the case but it is unreachable — the early-return is the live path.

## Product reorder — correct swap pattern
`moveSort` in `ProductsPanel` must copy the array, read both sortOrder values, then set them in a single pass.

**How to apply:** Always do `[arr[i], arr[j]] = [arr[j], arr[i]]` pattern.

## Route contract — slug-or-id
PUT/DELETE `/admin/products/:slugOrId` accepts either a numeric id or a slug string. Numeric strings resolve via `eq(productsTable.id, parseInt(...))`, others via `eq(productsTable.slug, ...)`.

## Price validation
`save()` in `ProductEditor` requires at least one of `priceINR` or `priceUSD` to be non-empty. Backend `insertProductSchema` does not enforce price at the DB level.

## zod in api-server
Do NOT import `zod` directly in api-server routes — it's not a direct dep and esbuild will fail. Use schemas from `@workspace/db` (`insertProductSchema` etc.).

## CRITICAL: Cloudflare fetch uses hardcoded /api — must use API_BASE
App.tsx fetches `${API_BASE}/products` and `${API_BASE}/site-content`. `API_BASE` = `import.meta.env.VITE_API_BASE || "/api"`. On Cloudflare Pages without `VITE_API_BASE` set at build time, ALL API fetches go to `xiyora-home.pages.dev/api/...` (wrong) and silently fall back to hardcoded `PRODUCTS` array, making admin edits invisible on the public site.

**Fix:** Set `VITE_API_BASE=https://xiyora--xiyora52.replit.app/api` in Cloudflare Pages → Settings → Environment Variables, then trigger a new Cloudflare Pages deployment.

**Why:** Vite bakes `import.meta.env.*` at build time — the env var must be set before the Cloudflare build runs.

## Image upload — object storage secret NOT available in production
`setupObjectStorage()` sets `DEFAULT_OBJECT_STORAGE_BUCKET_ID` as a Replit secret, but this secret does NOT propagate to the production deployment container even after re-deploy. Workaround: bucket ID is hardcoded as fallback in `upload.ts`: `"replit-objstore-f5c6c0fb-05e1-4bf6-b0ca-ae6a268ccc69"`.

**Why:** Replit secrets set via `code_execution` sandbox appear in dev but not in production containers. The bucket ID is not sensitive (GCS access gated by Replit sidecar at 127.0.0.1:1106, which IS present in production).

## Image upload — must return absolute backend URLs
Upload returns `https://xiyora--xiyora52.replit.app/api/uploads/<objectName>` (reconstructed from `x-forwarded-host` header). Images are served via `GET /api/uploads/:bucket/:slug/:filename` which proxies from GCS — NOT public GCS URLs (makePublic() silently fails with sidecar auth). Stored URLs must be absolute because the Cloudflare frontend loads images via `<img src>`, not through the API proxy.

## Checkout form — new fields (June 2026)
`checkoutIntentsTable` now has `fullAddress`, `landmark`, `company`, `gstNumber` text columns. Form field order: name → phone → email → **state → city** → pincode → fullAddress (required textarea) → landmark / company (optional, 2-col). CSS class `.co-form-grid` collapses to 1 col at ≤600px. The confirmed summary always shows (not gated on delivery lookup). All new fields flow into WA messages and proforma "Bill To" section.

**Why:** Previous form had no full address; mobile layout overflowed because inner form grid used inline `gridTemplateColumns:"1fr 1fr"` with no media-query override.

## FX rates backend endpoint
`GET /api/fx-rates` — in-memory 24 hr cache, fetches from `open.er-api.com/v6/latest/INR`, hardcoded INR-based fallback rates if fetch fails. Frontend `useLiveFx` tries backend first, then falls back to direct external fetch. DB `push-force` run after schema change.

## Seed endpoint
`POST /api/admin/seed` upserts all 37 products into the DB. Production DB is separate from dev DB. After any new deployment, seed may need to be re-run if production DB was reset. 37 products confirmed in production as of June 3 2026.

## ENV status (production)
- ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET, SESSION_SECRET, DATABASE_URL, DEFAULT_OBJECT_STORAGE_BUCKET_ID: all PRESENT
- NODE_ENV, PORT: MISSING from secrets (injected by Replit runtime — healthz confirms `"env":"production"`)

## Cloudflare deployment (xiyora-home.pages.dev)
Separate deployment from Replit. Must set `VITE_API_BASE=https://xiyora--xiyora52.replit.app/api` in Cloudflare Pages env vars and redeploy for:
- Products, site content to load from Replit backend
- Admin edits to show on the public site
- Uploads to appear correctly
CORS allowlist in `app.ts` already includes `https://xiyora-home.pages.dev`.
