# Project: XIYORA Front-End & Connectivity Overhaul

## Architecture
- React 18 + Vite + TypeScript + Tailwind CSS / Luxe CSS design system.
- Components: `src/App.tsx` (main application views, modals, state), `src/components/AdminPanel.tsx` (admin interface), `src/ErrorBoundary.tsx` (error boundary), `src/styles/luxe.css` (custom design system & overrides), `index.html` (static loader & HTML entry point).
- Data Flow: React state (`PRODUCTS`, `BIZ`, `FX`, cart, wishlist, currency) synced via backend API endpoints (`/products`, `/site-content`, `/fx-rates`, `/enquiries`, `/checkout-intents`) with static fallback constants when offline.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1.1 Design System Contrast Fixes | Eliminate late dark text overrides (`!important` rules) in `luxe.css` for `.btn-ivory`, `.sl`, `.sec-label`, `.gold-grad`, `.gold-italic`, `.btn-gold-out`, `.bt-chip:hover`, `.ql-card:hover .ql-arrow`, `.cat-card-explore`, `.x-link:hover`, `.cat-intro .ci-label`, `.nl`, `h2.serif` | M1 | survey |
| 2 | R1.2 Component Inline Text & Form Contrast | Fix low-contrast inline text in `App.tsx` (`SimplePage` light-on-light text bug, form labels `lbl`, placeholders, strike prices, footer copy `.fl`) and `AdminPanel.tsx` (`#888`/`#aaa` text on dark `#1E1E1C`) to meet WCAG AA (>= 4.5:1 ratio) | M1 | survey |
| 3 | R2.1 Loading Screen & Hydration Progression | Eliminate static `#xi-loader` DOM removal flash on mount; implement smooth 1% -> 100% counter progression in `<LoadingScreen />` with rAF/optimized timer (0 black screens, 0 frame drops) | M2 | survey |
| 4 | R2.2 Connectivity Resilience & Auto-Retry | Replace raw single-attempt `fetch` in `/products`, `/site-content`, `/fx-rates`, `/enquiries`, `/checkout-intents` with `fetchWithRetry` (exponential backoff) and replace `AbortSignal.timeout` with `AbortController` | M2 | survey |
| 5 | R2.3 Offline Banner & Unhandled Rejection Safeguard | Add `OfflineBanner` component for network drops and global `unhandledrejection` / `error` event listeners in `ErrorBoundary.tsx` | M2 | survey |
| 6 | R3.1 UI Design, Card Alignment & Design System Polish | Standardize card border radius (`2.5rem` vs `4px`), harmonize Asian decorative elements (`Bamboo`, `GoldCloud`, `Sakura`, `Seal`, `petal-layer`), polish typography & spacing tokens | M3 | survey |
| 7 | R3.2 Responsive Layouts & Overlays Polish | Fix touch scrolling (`-webkit-overflow-scrolling`) & mobile header clipping in `SideDrawer`, fix mobile title collision in `WishlistDrawer`, fix mobile soft keyboard button pushing in `InquiryModal`, fix contrast & table alignment in `GlobalFreightCalculator`, and add tablet 768px-1024px intermediate 2-col layout | M3 | survey |
| 8 | R3.3 Interactive States (Hover/Focus/Active/Disabled) | Add visible `:focus-visible` focus ring styles to all buttons, links, inputs, and drawer triggers; add global `button:disabled` / `input:disabled` rules | M3 | survey |
| 9 | R4.1 TypeScript Compilation & Build Optimization | Maintain 100% clean `pnpm run typecheck` (0 errors); optimize Rollup build bundle chunking in `vite.config.ts` and code-split `AdminPanel` so `pnpm run build` completes in <10 seconds | M4 | survey |
| 10 | R4.2 E2E Final Verification & Quality Gate | Perform automated static analysis, node contrast verification scripts, bundle verification, and E2E validation across all 15+ views | M4 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Contrast & Readability Overhaul (WCAG AA) | R1.1 & R1.2: Overhaul `luxe.css` contrast overrides, fix `SimplePage` invisible text bug, fix form labels, placeholders, footer copy, and AdminPanel text | none | DONE |
| 2 | M2: Seamless Loading & Connectivity Resilience | R2.1, R2.2 & R2.3: Smooth hydration loader 1%->100%, network auto-retry helper `fetchWithRetry`, AbortController compatibility, OfflineBanner, global unhandled rejection handler | M1 | IN_PROGRESS |
| 3 | M3: Premium UI Design & Responsive Polish | R3.1, R3.2 & R3.3: Card alignment, decorative element harmonization, responsive overlays (SideDrawer, WishlistDrawer, InquiryModal, Freight Calculator), tablet grid breakpoints, focus rings, disabled button states | M1, M2 | PLANNED |
| 4 | M4: Build Optimization & E2E Verification | R4.1 & R4.2: Code-split AdminPanel, optimize Rollup manualChunks, verify clean `pnpm run typecheck` (0 errors), verify `pnpm run build` (<10s), run contrast & build verification scripts | M1, M2, M3 | PLANNED |

## Interface Contracts
### Design System ↔ Components
- Design Tokens in `src/styles/luxe.css`:
  - Ivory Primary: `#F5F2ED` (Light text/bg)
  - Ivory Muted: `#E5DFCD` / `#C8C3BA`
  - Obsidian Dark: `#1A1A1A` (Dark bg/text)
  - Charcoal Dark: `#222222` / `#1E1E1C`
  - Rose Accent: `#C8C3BA` / `#E8D6B4`
- Button Classes:
  - `.btn-ivory`: Light background `#F5F2ED` with dark `#1A1A1A` text in all contexts.
  - `.sl, .sec-label`: High-contrast overline text (`#C8C3BA` on dark, `#1A1A1A` on light).
  - `.gold-grad`: Gold linear gradient text clip on dark background.

### Connectivity ↔ API Services
- Helper `fetchWithRetry(url: string, options?: RequestInit, retries?: number, backoff?: number)`: Returns `Promise<Response>`, automatically retrying 5xx or network errors up to 2 times with exponential backoff.
- Offline status listener: `navigator.onLine` toggles `OfflineBanner` rendering without interrupting app functionality or falling back to static `PRODUCTS` / `BIZ` constants.

## Code Layout
- `src/App.tsx`: Primary application containing view routing, header, footer, modals, cart, wishlist, freight calculator, static pages.
- `src/components/AdminPanel.tsx`: Admin dashboard & management interface.
- `src/styles/luxe.css`: Global styles, design tokens, utility classes, overrides.
- `src/ErrorBoundary.tsx`: React root error boundary & global exception handlers.
- `index.html`: Entry HTML with raw `#xi-loader` DOM element.
- `vite.config.ts`: Vite compilation, path aliases, output directories, rollup chunking.
