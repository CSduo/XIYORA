# XIYORA — Premium Natural Latex Bedding

A premium natural-latex bedding ecommerce single-page app (Talalay/Dunlop pillows,
mattresses, toppers, cushions) with a small Express + PostgreSQL backend for capturing
enquiries, subscriptions, and checkout intents.

Built as a pnpm monorepo. The storefront is a single-file React + Vite app; the API is
an Express 5 service backed by Drizzle ORM / PostgreSQL.

## Monorepo layout

```text
artifacts/
  xiyora/          # React + Vite storefront (single-file SPA: src/App.tsx)
  api-server/      # Express 5 API (enquiries, subscriptions, checkout-intents)
  mockup-sandbox/  # Component preview server (design tooling)
lib/
  db/              # Drizzle schema + client (@workspace/db)
```

## Run & operate

Apps run via Replit workflows (which inject `PORT`/`BASE_PATH`). To run locally on Replit,
use the workflows rather than `pnpm dev` at the root.

- `pnpm --filter @workspace/xiyora run dev` — storefront
- `pnpm --filter @workspace/api-server run dev` — API server
- `pnpm --filter @workspace/xiyora run typecheck` — typecheck the storefront
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Environment

See `.env.example`. Required: `DATABASE_URL`. Optional: `ADMIN_SECRET` (guards admin list
endpoints via the `x-admin-secret` header), `SESSION_SECRET`, `LOG_LEVEL`, `NODE_ENV`.
`PORT` and `BASE_PATH` are provided by the Replit workflow — do not set them manually.

## API

Base path `/api`. POST endpoints return `{ success: true, id }`.

- `POST /api/enquiries`, `GET /api/enquiries` (admin)
- `POST /api/subscriptions`, `GET /api/subscriptions` (admin)
- `POST /api/checkout-intents`, `GET /api/checkout-intents` (admin)
- `GET /api/quote-requests` (admin) — enquiries filtered to quote requests
- `GET /api/order-status?ref=...`

Admin GET endpoints require the `x-admin-secret` request header to match `ADMIN_SECRET`
(otherwise `403`). Request bodies are validated with `drizzle-zod` insert schemas.

## Storefront notes

- Single-file SPA at `artifacts/xiyora/src/App.tsx`, wrapped by an `ErrorBoundary`.
- Resilient `apiPost` (12s `AbortController` timeout + diagnostics; returns
  `{ success: false, error }` on failure).
- Multi-currency display (INR base; indicative rates for USD/AED/EUR/GBP/SGD/AUD with a
  disclaimer). UPI payment stays INR.
- Checkout computes package counts + domestic delivery; offers a printable
  Proforma/Estimate (explicitly "not a tax invoice").
- On API failure, checkout/enquiry flows fall back to WhatsApp, email (mailto), retry, and
  a local printable proforma so no lead is lost.
- Premium CSS/SVG motion system with scroll reveals, staggered hero, card lifts, button
  sweep, WhatsApp FAB pulse — all gated behind `prefers-reduced-motion`.

## Assets

Product/category/document images live under `artifacts/xiyora/public/assets/`. Image
references in `App.tsx` use graceful fallback chains. Do not invent pricing, delivery
promises, certificate claims, or payment-success states.

## Stack

pnpm workspaces · Node.js 24 · TypeScript 5.9 · Express 5 · PostgreSQL + Drizzle ORM ·
Zod (`zod/v4`) + `drizzle-zod` · React + Vite · esbuild.
