# Original User Request

## 2026-08-07T12:14:04+05:30

Research, audit, fix, and overhaul the entire front-end and connectivity layer of the XIYORA platform. Eliminate all invisible text / contrast bugs (e.g. light text on light buttons like 'B2B Partnership', 'Request B2B Quote', 'Join Businesses'), eradicate loading screen gaps, fix responsive & UI layout loose ends, resolve any network/connectivity error boundaries, and verify 100% readability across every page and component.

Working directory: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora`
Integrity mode: development

## Requirements

### R1. Complete Contrast & Readability Audit (Zero Invisible Text)
- Audit every single component, button, modal, form input, hero section, card, and footer across all 15+ views.
- Fix all instances where text matches or closely blends into its background (e.g. `.btn-ivory` text `#EDE8DF` on `#d4d0cb` background, form labels, secondary buttons, tags, badges, and dark/light mode toggles).
- Guarantee all text meets WCAG AA contrast standards (contrast ratio >= 4.5:1 for body text, >= 3:1 for large text & buttons).

### R2. Seamless Loading, Hydration & Connectivity Error Resilience
- Ensure the loading screen transitions smoothly from 1% to 100% with zero black-screen flashes, jerks, or unhandled promise rejections.
- Implement robust network retry mechanisms and error fallbacks for API requests (`/products`, `/site-content`, B2B forms, freight calculator, currency conversion).
- Add offline/degraded network banners or fallback UI so the user is never stranded on a blank page if an API call fails or lags.

### R3. Premium Front-End Design & Loose Ends Overhaul
- Polish all UI components, card alignments, typography scales, spacing tokens, and decorative elements (bamboo, sakura, ink-wash landscapes, product cards).
- Fix responsive layout bugs on mobile, tablet, and ultra-wide viewports (navigation drawer, wishlist overlay, product modal, freight calculator).
- Ensure all interactive elements (buttons, inputs, links, filters, wishlist toggles) have clear hover, focus, active, and disabled states.

### R4. Automated Verification & End-to-End Testing
- Validate 100% clean TypeScript compilation (`pnpm run typecheck` with 0 errors).
- Build production bundle cleanly (`pnpm run build`).
- Verify zero console errors or unhandled promise rejections during full site navigation.

## Acceptance Criteria

### Visual & Readability Guardrails
- [ ] 0 instances of low-contrast or invisible text across all pages (Home, Catalog, B2B/Supplier, Product Detail, Freight Calculator, Checkout, Admin, FAQs, Privacy/Terms).
- [ ] `.btn-ivory` and all secondary buttons have sharp high-contrast text (`#1a1a1a` on light buttons, `#ffffff` on dark buttons).
- [ ] All form placeholders, labels, tags, and helper text are easily readable under all light/dark themes.

### Performance & Connectivity Guardrails
- [ ] Loading screen counter progresses 1% → 100% smoothly with 0 black screens or frame drops.
- [ ] All API fetches (`/products`, `/site-content`) fail safely with user-friendly fallbacks if offline.
- [ ] Checkout, B2B forms, and freight calculator handle input validation cleanly without console errors.

### Build & Code Integrity
- [ ] `pnpm run typecheck` passes cleanly with 0 TypeScript errors.
- [ ] `pnpm run build` completes successfully in under 10 seconds.
- [ ] Code committed and deployed cleanly to git.
