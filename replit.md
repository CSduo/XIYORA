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

- Storefront SPA: `artifacts/xiyora/src/App.tsx` (single file, ~3.4k lines). Global CSS/motion system is the `CSS` template string in that file; error wrapper `artifacts/xiyora/src/ErrorBoundary.tsx` wired in `main.tsx`.
- Design system (Asian-luxury editorial redesign): Playfair Display (headings) + Inter (body), loaded once via `index.html` (no CSS `@import`). Palette tokens `C`/`CD` include `ink`/`seal`/`taupe` keys. Reusable decorative components live just after `Reveal`: `Seal` (red 印 stamp), `GoldCloud`, `Sakura`, `Monogram` ("XIYORA / Crafted Comfort"), plus `Stagger` reveal wrapper. Motif CSS classes (`.serif .paper .ink-wash .seal .x-divider .x-link/.ar .x-frame .x-drift(-slow) .x-tag .brush-edge .x-stagger .cc-tag .feat-ic`) sit in the "ASIAN-LUXURY MOTIF SYSTEM" block; all animated classes are gated behind `prefers-reduced-motion`.
- Dark-luxury HOMEPAGE redesign (black-lacquer + ivory + soft gold, Chinese/Japanese maximalist ornamentation): components live after `IconStrip` — `DECO` (path constants for gold motifs), `CornerFlourish`/`CornerSet`, `Petals` (CSS-only floating petals, stable `useState` initializer), `MonoMark`, `Rosette` + `ArchedCartouche` (open gold arch w/ floral-rosette apex framing the brand lockup; matches the reference mockups' arched cartouche), `DarkHomeHero`, `DarkBusinessBand`, `FooterTrustStrip`. Dark-lux CSS classes (`.lux-noir .ornate .gold-italic .gold-grad .feat-circ .btn-gold-out .btn-ivory .deco-float .petal .petal-layer .lux-feat-row .biz-feat .trust-grid .trust-item`) plus hero-copy/nav responsive classes (`.lux-hero-copy .lux-brand-lock .lux-bingxi .lux-cta-row` and `.nav-cartouche .nav-mono .nav-brand-x .nav-brand-sub .nav-right .nav-cur .nav-theme .nav-wish`) sit after the icon-strip mobile media query in the global `CSS` string; all motion gated behind `prefers-reduced-motion`. HomeView uses `DarkHomeHero`/`DarkBusinessBand`/`FooterTrustStrip` (LuxHero remains for catalog/other pages). Navbar center is an ornate cartouche (circle-X monogram + XIYORA serif + 舒适·自然·匠心 + flanking sakura). Ticker is gold-on-near-black.
- Asian-luxury HOMEPAGE section redesign (4-mockup spec): new reusable components live BEFORE `WhatsAppPopup` — `GoldIconBadge`, `OrnamentalFrame` (`.ornate`+`CornerSet`), `PremiumQuickLinks` (dark ornate quick-nav band w/ gold cross divider + center rosette; replaces old quick-nav band), `DarkBenefitStrip` (`BENEFITS` const; dark `.benefit-noir` row; replaces the homepage `IconStrip` promise call), `CategoryIntroPanel` (ivory `.cat-intro`+`CornerSet`, 选 seal; used inside the Categories header `<Reveal>`), `LatexStoryPanel` (full-bleed latex-closeup photo + ink overlay + gold hairline frame + bottom wave SVG; inserted AFTER Categories `</section>`, before FEATURED). `BuyerBestFit` rewritten to dark noir (`.bt-noir` gold pills + dark result card + crane/rabbit/sakura deco around borders; no `useC()`). HomeView "Our Promise" is now a sage+still-life 2-up (`.promise-2up`, gold frame/`CornerSet`/`美` seal/`@media(max-width:820px)` stacks). Navbar has mirrored top-right corner ornament + gold bottom hairline. CSS utility classes added at end of global `CSS`: `gold-badge ql-grid ql-card ql-cross benefit-noir bt-noir cat-intro latex-story gold-line-btn cloud-drift idle-bob` + `goldShimmer/cloudDrift/idleBob` keyframes (all reduced-motion-gated); `DARK_CSS` overrides `.paper`/`.ink-wash::before` to dark bg so light text stays readable in dark mode.
- DECORATION-OVER-PHOTOS GUARDRAIL (architect-flagged regression fix): decorative motif `<img>` (sakura/crane/rabbit/bamboo) must NEVER be pinned over a product/room photo — only borders/corners/empty dark areas. `DarkHomeHero` right photo panel and `LatexStoryPanel` use a gold-hairline border frame (`position:absolute;inset:14-18;border:1px solid rgba(200,169,126,.x)`) instead of motifs over the image. Faint section-level ambient `Petals` are allowed (atmosphere, not obscuring motifs).
- READABILITY/NAME-VISIBILITY RULE (regression fix): in `DarkHomeHero` all decorative `<img>` motifs (sakura/crane/rabbit/bamboo) are `zIndex:1` (BEHIND text); text/brand content is `zIndex:3`. Never put a decorative image above the brand wordmark — that previously hid "XIYORA" in the hero. Nav cartouche uses `whiteSpace:nowrap` + `minWidth:0`; on mobile (`@media max-width:640px`) the 舒适 subtitle + flanking sakura (`.nav-ornament`, now hidden ≤640) are dropped and brand shrinks; (`≤430`) the theme toggle + wishlist icons hide to stop the right-icon group overflowing and clipping the brand. On `≤900px` `.lux-hero-copy` centers (cartouche/headline/feature row/CTAs).
- SHOP-BY-CATEGORY section (mockup rebuild): ivory `CategoryIntroPanel` header + dark luxury card grid. `catImages` map (~L2534) → 5 images at `public/assets/categories/category-{mattresses,pillows,toppers,cushions,latex-material}-premium-asian-luxury.png`; `CAT_CARDS` array (~L2540, fields filter/name/sub/cn/wide); `CategoryCard` component (~L2513, a `<button>` w/ img(onError→FALLBACK_IMG, lazy)+grad+2 gold corners+vertical CN tag+body(title/sub/Explore→); local `imgErr` useState; calls `onCatFilter(filter)`). Markup is the `CatSection` JSX const (~L2548): `<Reveal>`+`CategoryIntroPanel` then `<Stagger className="cat-grid6">` mapping `CAT_CARDS`→wrapper `<div className={wide?"sp3":"sp2"}>`→`CategoryCard`; used once at HomeView main return (~L2599). CSS (~L1255): `.cat-grid6`(6-col)+`.sp2`/`.sp3` spans give desktop 3-up row1 + 2 wider centered cards row2; `.cat-card(-wide)`/`-img/-grad/-body/-title/-sub/-explore/-arr`, `.cat-vtag`, `.cat-corner.tl/.tr`; hover img-zoom+gold-glow+arrow; `@900` (2-col, spans reset) & `@600` (1-col); all motion reduced-motion-gated.
- Decorative gold motifs (transparent PNG): `artifacts/xiyora/public/assets/lux/deco/` — sakura-cluster, sakura-corner, gold-crane, gold-rabbit, crane-medallion, gold-bamboo.
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

- Do NOT invent pricing, delivery promises, certificate claims, or payment-success states. Currency rates are explicitly indicative (labelled via `CURRENCY_DISCLAIMER`); supported currencies are INR/USD/AED/EUR/GBP/SGD/AUD (INR base). Use "Proforma/Estimate" language, never "GST Invoice" — `BIZ.gstNote` and all user-facing copy now say "formal tax documentation … after GST registration" (honest/conditional), never claim a GST invoice is issued.
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
