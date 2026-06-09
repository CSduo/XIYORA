# XIYORA

**Premium Natural Latex Bedding — India's Official Bingxi Sourcing Partner**

XIYORA is a premium import/export sourcing platform built with React + Vite (frontend) and Express + PostgreSQL (backend). It serves home buyers, retailers, hotels, and B2B trade partners with natural latex mattresses, pillows, toppers, cushions, and inner latex materials.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS |
| Backend | Express 5 + Node.js 24 + TypeScript |
| Database | PostgreSQL via Drizzle ORM |
| Validation | Zod v4 + drizzle-zod |
| Build | esbuild (API) + Vite (frontend) |
| Package manager | pnpm workspaces |

---

## Project Structure

```
XIYORA/
├── artifacts/
│   ├── xiyora/          # React + Vite frontend SPA
│   │   ├── src/App.tsx  # Main app (~3,400 lines, single-file)
│   │   └── public/      # Static assets (images, fonts, documents)
│   └── api-server/      # Express REST API
│       └── src/
│           ├── app.ts   # Express app (CORS, middleware, routes)
│           ├── index.ts # HTTP server entry (not used on Vercel)
│           ├── routes/  # API route handlers
│           └── lib/     # Auth, logger, storage helpers
├── lib/
│   ├── db/              # Drizzle schema + migrations
│   ├── api-spec/        # OpenAPI spec + codegen
│   └── api-zod/         # Generated Zod schemas
├── api/
│   └── server.ts        # Vercel serverless entry point
├── vercel.json          # Vercel deployment config
└── .env.example         # Environment variable template
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 24+
- pnpm 9+
- PostgreSQL database

### Install
```bash
pnpm install
```

### Environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL, ADMIN_SECRET, etc.
```

### Run API server
```bash
pnpm --filter @workspace/api-server run dev
# Runs on PORT specified in .env (default: 5000)
```

### Run frontend
```bash
# In a separate terminal:
cd artifacts/xiyora
PORT=3000 pnpm run dev
# Vite dev server at http://localhost:3000
```

### Push DB schema changes
```bash
pnpm --filter @workspace/db run push
# ⚠️ Dev only — never run against production DB without review
```

### Typecheck
```bash
pnpm run typecheck
```

---

## Deploying to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CSduo/XIYORA)

### Manual deploy

1. **Import repository** at [vercel.com/new](https://vercel.com/new) → select `CSduo/XIYORA`
2. Vercel will auto-detect `vercel.json` — no framework preset selection needed
3. **Set Environment Variables** in Vercel → Project Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `ADMIN_SECRET` | ✅ | Admin panel JWT secret |
| `VITE_API_BASE` | ✅ | Public API URL (e.g. `https://xiyora.vercel.app/api`) |
| `SESSION_SECRET` | ✅ | Session signing secret |
| `ALLOWED_ORIGINS` | Optional | Extra comma-separated CORS origins |
| `WHATSAPP_ACCESS_TOKEN` | Optional | Meta Graph API token for WA notifications |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional | WhatsApp Business phone ID |
| `WHATSAPP_NOTIFY_TO` | Optional | Recipient number (no +, with country code) |

4. **Deploy** — Vercel builds the frontend and deploys the API as serverless functions
5. **Seed the database** (first deploy only):
   ```
   POST /api/admin/seed
   Header: x-admin-secret: YOUR_ADMIN_SECRET
   ```

### Image Uploads on Vercel

The upload system uses **Cloudinary** as the primary storage provider (works on Vercel, Replit, and anywhere). To enable admin image uploads:

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to your Cloudinary **Dashboard** → copy the Cloud Name, API Key, and API Secret
3. Add to Vercel → Project Settings → Environment Variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

If Cloudinary vars are **not set**, uploads automatically fall back to Replit Object Storage (which only works inside Replit containers). On Vercel without Cloudinary, the upload endpoint returns an error.

---

## Admin Panel

The admin panel is accessible at `/xiyora-admin` in the frontend.

- **Login**: `ADMIN_USERNAME` / `ADMIN_PASSWORD` (set as env vars)
- **JWT** is stored in `localStorage` as `xiyora_admin_token`
- **Protected API endpoints** require header `x-admin-secret: YOUR_ADMIN_SECRET`

Admin capabilities:
- Products: create, edit, reorder, delete
- Site content: hero text, images, supplier section
- Upload: product/category/homepage images
- Seed: re-populate products from built-in dataset

---

## Environment Variables

See [`.env.example`](.env.example) for the full list with descriptions.

---

## Troubleshooting

### 4500 / WebSocket / Socket closed errors (Replit)
- Check Replit build logs and server logs
- Verify all env vars are set in Replit Secrets
- Run `pnpm install` then `pnpm run build`
- Add `/api/health` endpoint is reachable

### Vercel build fails
- Ensure `VITE_API_BASE` is set in Vercel env vars
- `PORT` must NOT be set manually — Vercel injects it
- Check that `DATABASE_URL` is correct and the DB is reachable from Vercel's region

### Admin edits not showing on frontend
- Ensure `VITE_API_BASE` is set to the correct API URL **before** Vercel builds
- Vite bakes `import.meta.env.*` at build time — change requires a redeploy

### Currency rates not updating
- `GET /api/fx-rates` fetches from `open.er-api.com` with a 24h in-memory cache
- Fallback rates are used if the external fetch fails

---

## Key Constants

| Constant | Value |
|----------|-------|
| UPI ID | `chaitanyagaikwad022@okicici` |
| UPI Name | `XIYORA` |
| WhatsApp | `+91 7028311226` |
| Email | `xiyatosaanvi@gmail.com` |
| Instagram | [@xiyora.zi](https://www.instagram.com/xiyora.zi/) |

---

## License

Private — all rights reserved. See business contact above for partnership enquiries.
