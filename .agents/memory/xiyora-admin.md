---
name: XIYORA Admin Panel
description: Architecture and key decisions for the /xiyora-admin panel and product DB migration.
---

# XIYORA Admin Panel

## Route
`/xiyora-admin` — renders `AdminPanel` component fullscreen (bypasses public nav/footer via early-return in App.tsx before the ThemeCtx/Navbar/Footer tree).

## Auth
- JWT-based: `POST /api/admin/login` verifies `ADMIN_USERNAME` + `ADMIN_PASSWORD` env secrets, returns JWT signed with `ADMIN_SECRET`.
- Middleware `requireAdmin` in `adminAuth.ts` accepts JWT Bearer token OR legacy `x-admin-secret` header.
- Token stored in `localStorage` under key `xiyora_admin_token`.

## DB
- New tables: `products` (37 seeded), `site_content` (6 keys seeded).
- Schema in `lib/db/src/schema/products.ts` and `siteContent.ts`.
- Seed script: `pnpm --filter @workspace/db run seed`.

## API routes (all under `/api`)
- `POST /admin/login` — JWT login
- `GET /products` — public visible products
- `GET /admin/products` — all products (admin)
- `POST /admin/products` — create product
- `PUT /admin/products/:slug` — update product
- `DELETE /admin/products/:slug` — delete product
- `POST /admin/products/reorder` — bulk sort order update
- `GET /admin/site-content` — get all site content
- `PUT /admin/site-content` — update site content keys
- `POST /admin/upload` — multer image upload to GCS, returns public URL

## Frontend product loading
Products load from `/api/products` on mount, overwrite the hardcoded `PRODUCTS` let-array, and call `forceProductRefresh()` (useReducer) to re-render. Hardcoded array serves as fallback if API is down.

## Image uploads
Uses `multer` + `@google-cloud/storage` in `routes/upload.ts`. Uploads to GCS bucket (`DEFAULT_OBJECT_STORAGE_BUCKET_ID`), makes object public, returns `https://storage.googleapis.com/...` URL.

## zod import
API server routes must import from `"zod"` (not `"zod/v4"`) — zod is not a direct dep of api-server, so use `insertProductSchema` from `@workspace/db` for validation and avoid importing zod directly in api-server routes.

**Why:** esbuild bundles the api-server and cannot resolve `zod/v4` subpath or bare `zod` unless it's a direct dep. The workspace uses zod v3-style imports.
