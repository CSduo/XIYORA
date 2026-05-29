# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Storefront SPA: `artifacts/xiyora/src/App.tsx` (single file, ~3.2k lines). Global CSS/motion system is the `CSS` template string in that file; error wrapper `artifacts/xiyora/src/ErrorBoundary.tsx` wired in `main.tsx`.
- Product/category/document images: `artifacts/xiyora/public/assets/` (all 62 referenced assets present).
- API routes: `artifacts/api-server/src/routes/{index,enquiries,subscriptions,checkoutIntents}.ts`; admin guard `artifacts/api-server/src/lib/adminAuth.ts`.
- DB schema (source of truth): `lib/db/src/schema/{index,enquiries,subscriptions,checkoutIntents}.ts`.
- Project docs: `README.md`, `.env.example` (repo root).

## Architecture decisions

- Frontend uses raw `apiPost` (not generated OpenAPI hooks); backend validates with `drizzle-zod` insert schemas.
- Lead capture is failure-tolerant: every submit flow has WhatsApp + email (mailto) + retry + local printable proforma fallbacks so a lead is never lost on API failure.
- Currency conversion is display-only and indicative; payment (UPI) always settles in INR.
- All motion is CSS/SVG only and gated behind `prefers-reduced-motion`; scroll reveals use a single `IntersectionObserver` via the `XReveal` component.

## Product

XIYORA — premium natural latex bedding ecommerce SPA (Talalay/Dunlop pillows, mattresses, toppers, cushions). Single-file React+Vite app at `artifacts/xiyora/src/App.tsx`.

User-facing capabilities:
- Video-first hero (`HeroMedia`) with image/error fallback chain.
- Catalog + product detail with variants. Multi-currency display: INR base with indicative rates for USD/AED/EUR/GBP/SGD/AUD via `priceIn`/`fmtMoney` (with `CURRENCY_DISCLAIMER`); navbar `<select>`; UPI payment always settles in INR.
- Basket + wishlist, both persisted to `localStorage` (`xiyora_cart`, `xiyora_wishlist`).
- Checkout (`CheckoutView`): "Saved for Later" wishlist with move-to-basket/remove; a "Step 1 · Confirm Details & Location" gate (validates name/phone≥10 digits/email/city/state/pincode 6-digit, draft prefilled from `xiyora_checkout_draft`); UPI payment locked until confirmed, then shows QR (`/assets/payment/upi-qr.png`) + UPI ID; editing fields after confirm forces re-confirmation. Computes package count + domestic delivery; printable Proforma/Estimate ("not a tax invoice") via `printProforma`; WhatsApp/email/retry fallbacks on API failure. Posts to `POST /api/checkout-intents`.
- Resilience: app wrapped in `ErrorBoundary`; `apiPost` has a 12s `AbortController` timeout + diagnostics, returns `{success:false,error}`.
- `BuyerBestFit` selector routing buyer types to catalog/B2B/inquiry.
- Interactive WhatsApp popup (`WhatsAppPopup`, sessionStorage `xiyora_whatsapp_popup_dismissed`, 9s/38%-scroll trigger).

## User preferences

- Do NOT invent pricing, delivery promises, certificate claims, or payment-success states. Currency rates are explicitly indicative (labelled via `CURRENCY_DISCLAIMER`); supported currencies are INR/USD/AED/EUR/GBP/SGD/AUD (INR base). Use "Proforma/Estimate" language, never "GST Invoice".
- Final product/category image replacement is out of scope unless explicitly asked — only prepare asset folders + manifest.
- Verify with `pnpm --filter @workspace/xiyora run typecheck` (not `build`, which needs workflow-provided `PORT`/`BASE_PATH`).
- Key constants in `App.tsx`: `UPI_ID="chaitanyagaikwad022@okicici"`, `UPI_NAME="XIYORA"`, `BIZ.wa="917028311226"`.

## Gotchas

- Admin GET endpoints return `403` unless the `x-admin-secret` header matches `ADMIN_SECRET`. If `ADMIN_SECRET` is unset, set it as a Replit Secret before using admin list endpoints.
- The checkout submit handler is `submitIntent` (not `submit`); the InquiryModal/contact handlers are named `submit`. Don't conflate them.
- All 62 image references in `App.tsx` map to files under `public/assets/`; verify with the ref-vs-file check before assuming an image is missing.
- No GitHub remote is configured — only the Replit `gitsafe-backup` remote. Pushing to GitHub requires connecting a remote first.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
