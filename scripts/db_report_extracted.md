## XIYORA Project — Complete Database Schema & API Routes Audit

---

### 1. DATABASE SCHEMA (Drizzle ORM + PostgreSQL)

**Location:** `lib/db/src/schema/` — 5 table schema files, all exported from `lib/db/src/index.ts`

---

#### Table 1: `products` (`productsTable`)
| Column | DB Column | Type | Constraints |
|--------|-----------|------|-------------|
| id | id | serial | PK |
| slug | slug | text | NOT NULL, UNIQUE |
| name | name | text | NOT NULL |
| category | category | text | NOT NULL |
| latexType | latex_type | text | nullable |
| latexContent | latex_content | text | nullable |
| tag | tag | text | nullable |
| badge | badge | text | nullable |
| headline | headline | text | nullable |
| shortDesc | short_desc | text | nullable |
| description | description | text | nullable |
| highlights | highlights | jsonb (string[]) | default [] |
| specs | specs | jsonb (Record<string,string>) | default {} |
| sizes | sizes | jsonb (string[]) | default [] |
| useCases | use_cases | jsonb (string[]) | default [] |
| heroImage | hero_image | text | nullable |
| gallery | gallery | jsonb (string[]) | default [] |
| priceINR | price_inr | text | nullable |
| priceUSD | price_usd | text | nullable |
| priceNote | price_note | text | nullable |
| deliveryNote | delivery_note | text | nullable |
| variants | variants | jsonb (Array<{label,sku?,priceINR,priceUSD}>) | default [] |
| visible | visible | boolean | NOT NULL, default true |
| sortOrder | sort_order | integer | NOT NULL, default 0 |
| createdAt | created_at | timestamp(tz) | NOT NULL, defaultNow |
| updatedAt | updated_at | timestamp(tz) | NOT NULL, defaultNow |

**Insert schema:** omits `id`, `createdAt`, `updatedAt`; validates at least one of `priceINR`/`priceUSD` required.

---

#### Table 2: `site_content` (`siteContentTable`)
| Column | DB Column | Type | Constraints |
|--------|-----------|------|-------------|
| id | id | serial | PK |
| key | key | text | NOT NULL, UNIQUE |
| value | value | text | NOT NULL, default "" |
| updatedAt | updated_at | timestamp(tz) | NOT NULL, defaultNow |

**Simple key-value store.** Allowed keys (hardcoded in route): `wa`, `email`, `ig`, `address`, `gstNote`, `heroImage`, `heroTitle`, `heroSubtitle`, `heroBody`, `promiseImage`, `supplierHeroImage`, `catImg_Mattresses`, `catImg_Pillows`, `catImg_Toppers`, `catImg_Cushions`, `catImg_LatexMaterial`

---

#### Table 3: `enquiries` (`enquiriesTable`)
| Column | DB Column | Type | Constraints |
|--------|-----------|------|-------------|
| id | id | serial | PK |
| name | name | text | NOT NULL |
| phone | phone | text | NOT NULL |
| email | email | text | nullable |
| company | company | text | nullable |
| city | city | text | nullable |
| state | state | text | nullable |
| pincode | pincode | text | nullable |
| customerType | customer_type | text | nullable |
| productName | product_name | text | nullable |
| productSlug | product_slug | text | nullable |
| selectedSize | selected_size | text | nullable |
| quantity | quantity | text | nullable |
| message | message | text | nullable |
| inquiryType | inquiry_type | text | nullable |
| intentLabel | intent_label | text | nullable |
| estimatedPort | estimated_port | text | nullable |
| estimatedPriceRange | estimated_price_range | text | nullable |
| currency | currency | text | nullable |
| status | status | text | NOT NULL, default "pending" |
| createdAt | created_at | timestamp(tz) | NOT NULL, defaultNow |

---

#### Table 4: `subscriptions` (`subscriptionsTable`)
| Column | DB Column | Type | Constraints |
|--------|-----------|------|-------------|
| id | id | serial | PK |
| email | email | text | NOT NULL |
| name | name | text | nullable |
| whatsapp | whatsapp | text | nullable |
| city | city | text | nullable |
| customerType | customer_type | text | nullable |
| interestCategory | interest_category | text | nullable |
| subscriptionType | subscription_type | text | nullable |
| createdAt | created_at | timestamp(tz) | NOT NULL, defaultNow |

---

#### Table 5: `checkout_intents` (`checkoutIntentsTable`)
| Column | DB Column | Type | Constraints |
|--------|-----------|------|-------------|
| id | id | serial | PK |
| name | name | text | NOT NULL |
| phone | phone | text | NOT NULL |
| email | email | text | nullable |
| state | state | text | nullable |
| city | city | text | nullable |
| pincode | pincode | text | nullable |
| fullAddress | full_address | text | nullable |
| landmark | landmark | text | nullable |
| company | company | text | nullable |
| gstNumber | gst_number | text | nullable |
| productName | product_name | text | nullable |
| currency | currency | text | nullable |
| estimatedPriceRange | estimated_price_range | text | nullable |
| paymentMode | payment_mode | text | nullable |
| status | status | text | NOT NULL, default "pending" |
| createdAt | created_at | timestamp(tz) | NOT NULL, defaultNow |

---

### 2. ALL API ROUTES

Base path: `/api` (set in `app.ts` line 76: `app.use("/api", router)`)

#### Authentication System
- **`requireAdmin` middleware** (`lib/adminAuth.ts`): Supports TWO auth methods:
  1. `x-admin-secret` header — timing-safe comparison against `ADMIN_SECRET` env var (legacy)
  2. `Bearer <JWT>` — JWT signed with `ADMIN_SECRET`, 24h expiry
- **Rate limiting**: In-memory, 5 attempts per 15 minutes per IP for login routes

---

#### Public Routes (No Auth)

| Method | Path | File | Description |
|--------|------|------|-------------|
| GET | `/api/health` | health.ts | Health check (uptime, DB status, env config check) |
| GET | `/api/healthz` | health.ts | Minimal health probe |
| POST | `/api/enquiries` | enquiries.ts | Submit enquiry (validates with Zod, sends WhatsApp notification) |
| POST | `/api/subscriptions` | subscriptions.ts | Submit email/newsletter subscription |
| POST | `/api/checkout-intents` | checkoutIntents.ts | Submit checkout intent (order request) |
| GET | `/api/order-status?ref=EQ-XXXX` | checkoutIntents.ts | Public order status lookup by reference (EQ-/QR-/CHK- prefix) |
| GET | `/api/products` | products.ts | Get all **visible** products (ordered by sortOrder, id) |
| GET | `/api/site-content` | siteContent.ts | Get all site content (key-value, with defaults merged) |
| GET | `/api/fx-rates` | fxRates.ts | Get live FX rates (INR base, 24h cache, fallback hardcoded) |
| GET | `/api/location/reverse?lat=&lng=` | location.ts | Reverse geocode via Nominatim (returns state, city, pincode, area) |
| GET | `/api/uploads/:bucket/:slug/:filename` | upload.ts | Serve image from Replit Object Storage (fallback only) |
| GET | `/api/uploads/:folder/:filename` | upload.ts | Serve image from Replit Object Storage (fallback only) |

#### Auth Routes (Login)

| Method | Path | File | Description |
|--------|------|------|-------------|
| POST | `/api/admin/login` | adminLogin.ts | Username/password login → JWT token (rate-limited) |
| POST | `/api/admin/google-login` | adminLogin.ts | Google OAuth login → JWT token (verifies against `ADMIN_GOOGLE_EMAIL`, rate-limited) |

#### Admin Routes (requireAdmin)

| Method | Path | File | Description |
|--------|------|------|-------------|
| GET | `/api/enquiries` | enquiries.ts | List all enquiries (desc by createdAt) |
| GET | `/api/quote-requests` | enquiries.ts | List enquiries where inquiryType is quote/proforma/bulk |
| GET | `/api/subscriptions` | subscriptions.ts | List all subscriptions (desc by createdAt) |
| GET | `/api/checkout-intents` | checkoutIntents.ts | List all checkout intents (desc by createdAt) |
| GET | `/api/admin/products` | products.ts | List ALL products (including invisible, by sortOrder) |
| POST | `/api/admin/products` | products.ts | Create a new product |
| PUT | `/api/admin/products/:slugOrId` | products.ts | Update product by slug or numeric ID (partial) |
| DELETE | `/api/admin/products/:slugOrId` | products.ts | Delete product by slug or numeric ID |
| POST | `/api/admin/products/reorder` | products.ts | Batch reorder products (array of {slug, sortOrder}) |
| GET | `/api/admin/site-content` | siteContent.ts | Get site content (same as public, but admin-gated) |
| PUT | `/api/admin/site-content` | siteContent.ts | Update site content (upsert for allowed keys) |
| POST | `/api/admin/upload` | upload.ts | Upload image (Cloudinary primary, Replit fallback; 10MB max, images only) |
| POST | `/api/admin/seed` | seed.ts | Seed DB with 46 hardcoded products + 6 site content entries (insert-only, skips existing) |

---

### 3. SEED DATA SUMMARY

The `seed.ts` file contains **46 hardcoded products** across 5 categories:
- **Pillows** (~18 products): Talalay Bread, Talalay Contour, Talalay Junior, Bumpy Massage, Dunlop Bone/Bread/Butterfly/Cloud/Contour/Contour High/Contour Junior/Couples/Cylinder/Seahorse/Stomach/Throw/U-Pillow, Peanut Massage, Spiky Massage
- **Mattresses** (3): Talalay Latex Mattress, Dunlop Bay Window Mattress, Dunlop Standard Mattress
- **Toppers** (1): Latex Topper
- **Latex Material** (7): Shredded Talalay, Hybrid with Bamboo/Gel/Graphene/Lavender/Negative Oxygen Ion/TCM
- **Cushions** (7+): Bottom Seat, Bubble Seat, Butterfly Back, Chunk Seat, Standard Back, Standard Seat, Triangle Back

Plus **6 site content entries**: hero_headline, hero_subheadline, contact_email, contact_phone, company_tagline, whatsapp_number.

---

### 4. SUPPORTING INFRASTRUCTURE

| File | Purpose |
|------|---------|
| `lib/adminAuth.ts` | JWT creation/verification, timing-safe compare, requireAdmin middleware |
| `lib/cloudinaryStorage.ts` | Upload images to Cloudinary (REST API, no SDK) |
| `lib/objectStorage.ts` | Replit Object Storage fallback (lazy-loaded) |
| `lib/objectAcl.ts` | ACL framework for object storage (unused placeholder) |
| `lib/whatsappNotify.ts` | Send WhatsApp notification on new enquiry via Meta API |
| `lib/logger.ts` | Pino logger with pino-pretty dev transport |
| `app.ts` | Express app setup: CORS (whitelist + *.vercel.app + *.pages.dev + localhost), JSON/urlencoded parsing, pino-http logging, 404/error handlers |
| `middlewares/` | Empty (only .gitkeep) |

---

### 5. WHAT'S MISSING FOR A COMPLETE ADMIN PANEL

Based on the audit, the following gaps exist:

**Missing Admin CRUD Operations:**
- ❌ **No status update routes** for enquiries (status field exists but no PUT/PATCH endpoint)
- ❌ **No status update routes** for checkout intents (status field exists but no PUT/PATCH endpoint)
- ❌ **No delete routes** for enquiries, subscriptions, or checkout intents
- ❌ **No single-item GET routes** for enquiries/checkout-intents/subscriptions (only list-all)
- ❌ **No admin notes/internal comments** on enquiries or orders

**Missing Tables:**
- ❌ **No `admin_users` table** — auth is ENV-based only (single hardcoded admin)
- ❌ **No `categories` table** — categories are just text strings on products
- ❌ **No `orders` table** — checkout_intents have status but no full order lifecycle
- ❌ **No `admin_activity_log` / audit trail table**
- ❌ **No `pages` or `banners` table** for broader CMS content

**Missing Features:**
- ❌ No pagination on any list endpoint (all return full dataset)
- ❌ No search/filter query params on admin list endpoints
- ❌ No CSV/Excel export endpoints
- ❌ No dashboard stats/analytics endpoint (counts, recent activity)
- ❌ No image deletion endpoint (Cloudinary images can't be removed via API)
- ❌ No bulk operations (bulk delete, bulk status update)

**Existing Strengths:**
- ✅ Full product CRUD with reorder
- ✅ Site content key-value management
- ✅ Image upload with Cloudinary
- ✅ JWT + Google OAuth admin login
- ✅ Seed data for initial setup
- ✅ WhatsApp notifications on enquiries
- ✅ FX rates and reverse geocoding utilities