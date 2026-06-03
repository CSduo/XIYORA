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

## Checkout form — fields and layout (June 2026)
`checkoutIntentsTable` has `fullAddress`, `landmark`, `company`, `gstNumber` text columns. Form order: Name+Phone (2-col) → **"Use my current location" button block** → State+City (2-col) → Pincode (with live delivery hint) → Full Address (textarea, required) → Landmark+Email (2-col optional) → Company (optional). CSS class `.co-form-grid` collapses at ≤600px. `.co-sum-row` class handles mobile-safe flex rows in order summary.

## Checkout delivery — live (not gated on confirm)
`delivery = /^\d{6}$/.test(form.pincode) ? lookupPincode(form.pincode) : null` — delivery estimate updates as user types pincode. Order summary shows zone, days, price, and estimated total **before** confirming.

**Why:** Users need to see shipping cost before they commit to confirming all details.

## Checkout location detection
`detectLocation()` calls `navigator.geolocation.getCurrentPosition`, proxies to `GET /api/location/reverse?lat=...&lng=...` (Nominatim/OSM, free, no key). Returns `{state, city, pincode, area}`. Auto-fills only reliable values; if pincode is not 6 digits it is not filled. Three user-facing messages: detected+filled / detected+no-pincode / permission denied.

**Why:** Nominatim is used server-side to avoid CORS. City field uses municipality → town → city_district → village → state_district fallback chain (Mumbai returns `municipality`, not `city`).

## WhatsApp enquiry notifications
`sendWhatsAppNotification()` in `artifacts/api-server/src/lib/whatsappNotify.ts`. Called fire-and-forget after enquiry saved in `routes/enquiries.ts`. Required env vars: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO` (recipient number with country code, no +). If any env var is missing, logs WARN and returns without breaking the save. Uses Meta Graph API v20.0 free-form text message.

**Why:** Free-form text (not template) works for sending to own/admin number. Template required only for user-initiated marketing. Notification must be non-blocking — enquiry DB save must not fail if WA is down.

## FX rates backend endpoint
`GET /api/fx-rates` — in-memory 24 hr cache, fetches from `open.er-api.com/v6/latest/INR`, hardcoded INR-based fallback rates if fetch fails. Frontend `useLiveFx` tries backend first, then falls back to direct external fetch. DB `push-force` run after schema change.

## Seed endpoint
`POST /api/admin/seed` upserts all 37 products into the DB. Production DB is separate from dev DB. After any new deployment, seed may need to be re-run if production DB was reset. 37 products confirmed in production as of June 3 2026.

## ENV status (production)
- ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET, SESSION_SECRET, DATABASE_URL, DEFAULT_OBJECT_STORAGE_BUCKET_ID: all PRESENT
- NODE_ENV, PORT: MISSING from secrets (injected by Replit runtime — healthz confirms `"env":"production"`)

## Homepage content is admin-controlled via BIZ object + siteContent API
`BIZ` in `App.tsx` has 11 fields: the original 6 contact/social fields PLUS `heroTitle`, `heroSubtitle`, `heroBody`, `promiseImage`, `supplierHeroImage`. All 11 are returned by `GET /site-content` (public) and editable via `PUT /admin/site-content`. `DEFAULT_SITE_CONTENT` in `siteContent.ts` mirrors the BIZ defaults. Admin SiteContentPanel is sectioned: Homepage Hero, Promise Section, Partnership/Supplier, Contact & Business Info.

**Why:** Owners need to change homepage text and images without code deploys.

## Loading screen — HTML-first loader pattern
`#xi-loader` in `index.html` shows immediately (before React loads). React dismisses it when `appReady=true` (both `productsLoading` and `siteLoading` become false). Safety timeout: 6 s. This prevents layout flash and white-screen between HTML parse and React first paint.

**How to apply:** `appReady` state gates loader dismissal only. Main app content always renders — the loader overlay just covers it until ready.

## URL routing — always use navigateTo(), never setPage() directly in child components
`navigateTo(page, opts)` is the only function that does `pushState + setPage`. All child components (SideDrawer, child views in renderView, Footer, etc.) receive `setPage={nav}` where `nav=(p)=>navigateTo(p)`. Passing raw `setPage` to children causes URL mismatch (state changes but URL doesn't). Navbar previously did its own `pushState` + `setPage` — this caused double-push; fixed by removing Navbar's manual `pushState` and letting `nav` handle it.

## SupplierView — dedicated B2B page component
`SupplierView` replaces `SimplePage` for the `/supplier` route. It's a full dark split-hero matching the home hero structure (`lux-hero-grid`, `lux-hero-photo-r`). Hero image comes from `BIZ.supplierHeroImage` (admin-controllable) with Unsplash fallback. Has process strip, B2B features grid, and CTA section.

## Cloudflare deployment (xiyora-home.pages.dev)
Separate deployment from Replit. Must set `VITE_API_BASE=https://xiyora--xiyora52.replit.app/api` in Cloudflare Pages env vars and redeploy for:
- Products, site content to load from Replit backend
- Admin edits to show on the public site
- Uploads to appear correctly
CORS allowlist in `app.ts` already includes `https://xiyora-home.pages.dev`.
