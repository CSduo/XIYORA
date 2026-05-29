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

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

XIYORA — premium natural latex bedding ecommerce SPA (Talalay/Dunlop pillows, mattresses, toppers, cushions). Single-file React+Vite app at `artifacts/xiyora/src/App.tsx`.

User-facing capabilities:
- Video-first hero (`HeroMedia`) with image/error fallback chain.
- Catalog + product detail with variants, currency toggle (INR/USD only).
- Basket + wishlist, both persisted to `localStorage` (`xiyora_cart`, `xiyora_wishlist`).
- Checkout (`CheckoutView`): "Saved for Later" wishlist with move-to-basket/remove; a "Step 1 · Confirm Details & Location" gate (validates name/phone≥10 digits/email/city/state/pincode 6-digit, draft prefilled from `xiyora_checkout_draft`); UPI payment locked until confirmed, then shows QR (`/assets/payment/upi-qr.png`) + UPI ID; editing fields after confirm forces re-confirmation. Posts to `POST /api/checkout-intents`.
- `BuyerBestFit` selector routing buyer types to catalog/B2B/inquiry.
- Interactive WhatsApp popup (`WhatsAppPopup`, sessionStorage `xiyora_whatsapp_popup_dismissed`, 9s/38%-scroll trigger).

## User preferences

- Do NOT invent pricing, delivery promises, certificate claims, payment-success states, or currency rates. Keep currency to INR/USD only (no AED/EUR/etc.).
- Final product/category image replacement is out of scope unless explicitly asked — only prepare asset folders + manifest.
- Verify with `pnpm --filter @workspace/xiyora run typecheck` (not `build`, which needs workflow-provided `PORT`/`BASE_PATH`).
- Key constants in `App.tsx`: `UPI_ID="chaitanyagaikwad022@okicici"`, `UPI_NAME="XIYORA"`, `BIZ.wa="917028311226"`.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
