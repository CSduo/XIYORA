# Comprehensive E2E Test Suite Design: XIYORA Aesthetic Re-engineering

## Executive Summary
This analysis details the design and architecture of an opaque-box E2E test suite for the XIYORA aesthetic re-engineering project. The suite programmatically validates the removal of AI-template clutter, the application of premium 2D styling contracts, and mobile responsiveness by parsing the compiled assets inside `dist/public` using a zero-dependency TypeScript parser.

---

## 1. NPM Dependency Investigation & Parser Strategy

### 1.1 Hoisted & Root Dependencies
An investigation of the root `package.json`, `pnpm-workspace.yaml`, and workspace dependency mapping in `node_modules/.modules.yaml` reveals the following:
- **Available packages**: `typescript` (~5.9.3) and `tsx` (4.21.0) are available globally in the workspace. `tsx` is used as the TypeScript execution engine in `scripts/package.json` to execute TS scripts directly.
- **Unavailable packages**: Headless browser automation libraries (like `playwright` or `puppeteer`) and DOM simulation environments (like `jsdom` or `happy-dom`) are **not** present in the dependency tree.

### 1.2 The Case for a Zero-Dependency Parser
Given the lack of headless browsers and JS DOM environments, and to avoid introducing heavy external dependencies, we propose a **zero-dependency static AST & RegExp parser** written in TypeScript. 
This approach is highly advantageous:
1. **Opaque-Box Compliance**: It treats the compiled production bundle (`dist/public`) as a black box, parsing the generated HTML, CSS, and JS files without relying on internal React functions.
2. **Speed & Reliability**: It executes in milliseconds, avoiding the latency and flakiness associated with spinning up browsers.
3. **Compatibility**: It runs seamlessly in restricted, offline, or low-privilege environments.

---

## 2. E2E Test Suite Architecture

The E2E test suite is structured around a central runner script `scripts/e2e-test.ts` which executes all 38+ test cases and exits with code 0 on success or 1 on failure.

```
XIYORA/
├── artifacts/xiyora/dist/public/  # Target compiled folder
│   ├── index.html                 # Main entrypoint
│   └── assets/
│       ├── index-*.js             # Compiled JS bundle
│       └── index-*.css            # Compiled CSS bundle
├── scripts/
│   └── e2e-test.ts                # E2E test runner
└── .agents/
    └── teamwork_preview_explorer_e2e_2/
        └── analysis.md            # This report
```

### 2.1 Asset Locator & Loader
The runner starts by locating the compiled assets. It reads `artifacts/xiyora/dist/public/index.html` and parses it to locate the links to CSS and script bundles:

```typescript
import fs from 'node:fs';
import path from 'node:path';

interface CompiledAssets {
  html: string;
  css: string;
  js: string;
  cssPath: string;
  jsPath: string;
}

function loadCompiledAssets(distPath: string): CompiledAssets {
  const htmlPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Build artifacts not found. Please compile the project first. Missing: ${htmlPath}`);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Regex to extract asset paths
  const cssMatch = html.match(/href="\/assets\/index-([^"]+)\.css"/);
  const jsMatch = html.match(/src="\/assets\/index-([^"]+)\.js"/);

  if (!cssMatch || !jsMatch) {
    throw new Error('Could not find compiled CSS or JS bundle paths in index.html.');
  }

  const cssRelativePath = `assets/index-${cssMatch[1]}.css`;
  const jsRelativePath = `assets/index-${jsMatch[1]}.js`;

  const cssPath = path.join(distPath, cssRelativePath);
  const jsPath = path.join(distPath, jsRelativePath);

  return {
    html,
    css: fs.readFileSync(cssPath, 'utf8'),
    js: fs.readFileSync(jsPath, 'utf8'),
    cssPath,
    jsPath
  };
}
```

### 2.2 CSS Rules Extractor & Matcher
The parser tokenizes the CSS to support querying rules by selector. It also handles media query blocks to verify responsiveness.

```typescript
interface CSSRule {
  selector: string;
  declarations: Record<string, string>;
  mediaQuery?: string;
}

function parseCSSRules(cssText: string): CSSRule[] {
  const rules: CSSRule[] = [];
  // Strip CSS comments
  const cleanCSS = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // 1. Extract Media Queries
  const mediaRegex = /@media\s*([^{]+)\{([\s\S]*?)\}\s*\}/g;
  let mediaMatch;
  let cssWithoutMedia = cleanCSS;

  while ((mediaMatch = mediaRegex.exec(cleanCSS)) !== null) {
    const mediaQuery = mediaMatch[1].trim();
    const mediaContent = mediaMatch[2].trim();
    cssWithoutMedia = cssWithoutMedia.replace(mediaMatch[0], '');

    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let ruleMatch;
    while ((ruleMatch = ruleRegex.exec(mediaContent)) !== null) {
      rules.push(parseSingleRule(ruleMatch[1], ruleMatch[2], mediaQuery));
    }
  }

  // 2. Extract Standard Rules
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let ruleMatch;
  while ((ruleMatch = ruleRegex.exec(cssWithoutMedia)) !== null) {
    rules.push(parseSingleRule(ruleMatch[1], ruleMatch[2]));
  }

  return rules;
}

function parseSingleRule(selectorText: string, bodyText: string, mediaQuery?: string): CSSRule {
  const selector = selectorText.trim();
  const declarations: Record<string, string> = {};
  bodyText.split(';').forEach((decl) => {
    const parts = decl.split(':');
    if (parts.length >= 2) {
      const prop = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      declarations[prop] = val;
    }
  });
  return { selector, declarations, mediaQuery };
}
```

---

## 3. Comprehensive Test Suite Specification (43 Test Cases)

### 3.1 Tier 1: Feature Coverage (18 cases)
Validates the direct completion of features F1 (AI-template removal), F2 (2D Premium styling), and F3 (Responsiveness).

#### Feature 1: AI-Template Aesthetic Removal (F1)
*   **T1-F1-01: Custom Cursor Class Elimination in CSS**
    *   *Description*: Verify that the custom cursor classes (`.xiyora-cursor`, `.xiyora-cursor-dot`) are absent from the CSS.
    *   *Verification*: Assert that `parseCSSRules` returns no rules matching `.xiyora-cursor` or `.xiyora-cursor-dot`.
*   **T1-F1-02: GoldCursor Component Eradication in JS**
    *   *Description*: Verify that the JS bundle does not contain or mount the `GoldCursor` component.
    *   *Verification*: Assert that the JS bundle string does not contain the substring `GoldCursor`.
*   **T1-F1-03: Ambient Gradient Orb Styles Removal**
    *   *Description*: Verify that the `.x-orb`, `.x-orb-gold`, `.x-orb-ivory`, `.x-orb-seal` class definitions are removed from CSS.
    *   *Verification*: Search CSS rules for selectors matching `.x-orb`, `.x-orb-gold`, etc. Assert 0 matches.
*   **T1-F1-04: Background Orb Elements Removal in JS**
    *   *Description*: Verify that the JS bundle does not render elements with background orb classes.
    *   *Verification*: Scan the JS bundle for occurrences of `x-orb`, `x-orb-gold`, `x-orb-ivory`, `x-orb-seal`. Assert 0 matches.
*   **T1-F1-05: Hero Canvas (Particle Background) Removal**
    *   *Description*: Verify that the particle canvas (`HeroCanvas` component or `.hero-particle-canvas` class) is removed.
    *   *Verification*: Check JS bundle for `HeroCanvas` or canvas animation loop patterns, and CSS rules for `.hero-particle-canvas`.
*   **T1-F1-06: 3D Card Tilt Math & Class Removal**
    *   *Description*: Verify that the 3D card tilt animation/rotation classes and calculations are removed.
    *   *Verification*: Check CSS rules for `.tilt-3d` and `.tilt-3d-inner`, and JS for mathematical expressions involving dynamic 3D rotation (`rotateX`, `rotateY`, `perspective(1000px)`).
*   **T1-F1-07: Shimmer Effect Styles Removal**
    *   *Description*: Verify that shimmers (`.tilt-card::after` light sweeps and `.gold-shimmer-text`) are removed.
    *   *Verification*: Check CSS for `.tilt-card::after` and `.gold-shimmer-text` selectors.
*   **T1-F1-08: Sakura Petals Overlay Removal**
    *   *Description*: Verify that the falling sakura petals overlay (`Petals` component, `.petal` class) is removed.
    *   *Verification*: Search JS bundle for `Petals` component and CSS for `.petal`, `.petal-layer`, `.petal i`.

#### Feature 2: 2D Premium Styling (F2)
*   **T1-F2-01: Section Divider Solid Borders**
    *   *Description*: Verify section dividers use solid borders with color `rgba(246, 239, 224, 0.08)`.
    *   *Verification*: Query rules for `.x-gold-divider` (or equivalent divider classes). Assert they specify `border` (or `border-bottom`/`border-top`) with a value of `1px solid rgba(246, 239, 224, 0.08)` and do not use gradient backgrounds (`linear-gradient`).
*   **T1-F2-02: Card & Button Organic Rounding Limits**
    *   *Description*: Verify that cards and buttons use border-radius between `2rem` (32px) and `3rem` (48px).
    *   *Verification*: Query CSS rules for card classes (e.g., `.pc-luxe`, `.cat-card`, `.testimonial-card`) and buttons (e.g., `.btn-gold-out`, `.btn-ivory`). Verify their `border-radius` declarations fall in the range `[32px, 48px]` or `[2rem, 3rem]`.
*   **T1-F2-03: Elimination of Outdated Small Border Roundings**
    *   *Description*: Ensure that old small roundings (e.g., `4px`, `7px`, `8px`, `2px`) are removed from all cards, buttons, stat badges, and testimonials.
    *   *Verification*: Scan CSS rules for card, button, and badge selectors. Ensure that no `border-radius` properties are set to values `< 12px`.
*   **T1-F2-04: Card & Button Fine Borders**
    *   *Description*: Verify that cards and buttons use `1px solid rgba(246, 239, 224, 0.08)`.
    *   *Verification*: Check CSS rules for `.pc-luxe`, `.glass-card`, `.stat-badge`, `.testimonial-card` to verify border styles are exactly `1px solid rgba(246, 239, 224, 0.08)` (or Tailwind border-color classes matching `border-[#F6EFE0]/8`).
*   **T1-F2-05: Typography Serif Headers**
    *   *Description*: Verify headings use 'Playfair Display' serif font.
    *   *Verification*: Scan CSS and HTML for tags `h1`, `h2`, `h3`, `h4`, `h5`, `h6` and `.serif` classes, verifying they have `font-family` set to `'Playfair Display'`.
*   **T1-F2-06: Typography Sans-serif Body**
    *   *Description*: Verify body text, labels, and buttons use 'Inter' sans-serif font.
    *   *Verification*: Scan CSS for `body`, `p`, `span`, `.xl-sub`, `button` styles to verify `font-family` is set to `'Inter'`.

#### Feature 3: Responsiveness (F3)
*   **T1-F3-01: Viewport Meta Tag Presence**
    *   *Description*: Verify the presence of a responsive viewport meta tag in `index.html`.
    *   *Verification*: Assert that `index.html` contains `<meta name="viewport" content="width=device-width, initial-scale=1` or similar.
*   **T1-F3-02: Layout Width Bounds (No Horizontal Scroll)**
    *   *Description*: Verify that there are no elements with fixed widths larger than `320px` without responsive overrides.
    *   *Verification*: Check CSS rules for fixed width declarations (e.g., `width: Xpx` where `X > 320`) and confirm they are overridden in media queries or use responsive units like `%`, `vw`, or max-width.
*   **T1-F3-03: Responsive Utility Classes Usage**
    *   *Description*: Verify that responsive layout classes are present in the HTML/JSX.
    *   *Verification*: Search HTML/JS bundle for Tailwind responsive utility patterns like `sm:`, `md:`, `lg:`, `xl:`.
*   **T1-F3-04: CSS Media Queries Existence**
    *   *Description*: Verify that CSS files contain `@media` rules for responsive breakpoints.
    *   *Verification*: Search CSS file content for `@media (max-width: ...)` or `@media (min-width: ...)` rules.
*   **T1-F3-05: Mobile Hamburger Menu Layout**
    *   *Description*: Verify that the hamburger button is visible on mobile screens and hidden on screens above 1340px.
    *   *Verification*: Check CSS rules for `.nav-hamburger` to verify media queries toggle its display between `block`/`flex` and `none`.
*   **T1-F3-06: SideDrawer Mobile Responsiveness**
    *   *Description*: Verify that the mobile side drawer container (`.sdrawer` or `.sdr-link`) layout is defined.
    *   *Verification*: Check CSS files for `.sdrawer` and `.sdr-link` rules and verify they are adapted for mobile screen widths.

---

### 3.2 Tier 2: Boundary & Corner Cases (15 cases)
Tests behavior at critical limits and transitions.

#### Feature 1: AI-Template Aesthetic Removal (F1)
*   **T2-F1-01: Cursor Fallback to Browser Native**
    *   *Description*: Verify that the global body style sets `cursor: auto` or similar browser default, and does not set `cursor: none`.
    *   *Verification*: Scan CSS rules for the `body` selector. Verify that the `cursor` property is not `none`.
*   **T2-F1-02: Complete Canvas Element Eradication**
    *   *Description*: Check that no `<canvas>` element exists in the markup or is dynamically created.
    *   *Verification*: Scan HTML for `<canvas>` tags, and JS for `document.createElement('canvas')`. Assert 0 occurrences.
*   **T2-F1-03: Removal of Floating Animation Keyframes**
    *   *Description*: Verify that keyframes for floating effects like `floatA`, `floatB`, `floatC` are removed or inactive.
    *   *Verification*: Scan CSS for `@keyframes floatA`, `@keyframes floatB`, `@keyframes floatC`. Assert 0 matches.
*   **T2-F1-04: Card Glow Outline Keyframes Absence**
    *   *Description*: Verify that `@keyframes goldBorderPulse` or other pulsing border styles are absent from CSS.
    *   *Verification*: Check CSS for `goldBorderPulse` keyframe definitions.
*   **T2-F1-05: Absence of 3D Perspective Properties**
    *   *Description*: Verify that perspective properties (`perspective`, `transform-style: preserve-3d`) are removed or disabled from cards.
    *   *Verification*: Scan CSS for `perspective:` and `preserve-3d` in card/container styles.

#### Feature 2: 2D Premium Styling (F2)
*   **T2-F2-01: Rounding Boundary - Under 32px (2rem)**
    *   *Description*: Ensure no border-radius values on cards, buttons, or badges are set between 1px and 31px (representing unauthorized small rounding).
    *   *Verification*: Scan CSS declarations of target components to verify that border-radius is either 0 or >= 32px (2rem).
*   **T2-F2-02: Rounding Boundary - Over 48px (3rem)**
    *   *Description*: Ensure no border-radius values on cards, buttons, or badges exceed 48px (3rem) unless it's a full circle (e.g. `50%` for profile pics or small circular icons).
    *   *Verification*: Verify border-radius values on target cards/buttons/badges are <= 48px (or <= 3rem).
*   **T2-F2-03: Border Color Transparency Level**
    *   *Description*: Verify that the opacity of the borders on cards/buttons is exactly 8% (`0.08`), as specified in `rgba(246, 239, 224, 0.08)`.
    *   *Verification*: Parse border color values in CSS and ensure they match `rgba(246, 239, 224, 0.08)` or Tailwind's hex-opacity format (e.g., `#F6EFE0` with `08` opacity).
*   **T2-F2-04: Font Style Fallback Hierarchy**
    *   *Description*: Verify that the font-family declarations have correct fallback fonts (e.g., `'Playfair Display', serif` and `'Inter', sans-serif`).
    *   *Verification*: Check CSS font-family strings to ensure fallback fonts are present and correct.
*   **T2-F2-05: CSS Custom Properties (CSS Variables) Integrity**
    *   *Description*: Verify that any custom CSS variables (like `--color-gold`, `--radius-luxe`) declared in `luxe.css` are updated to match the new organic rounding and fine border rules.
    *   *Verification*: Check `:root` declarations in CSS for visual system variable values.

#### Feature 3: Responsiveness (F3)
*   **T2-F3-01: Viewport Down to 320px Width Support**
    *   *Description*: Verify layout width safety styles to ensure responsiveness at the absolute lower bound of modern mobile viewports (320px).
    *   *Verification*: Scan CSS for elements with `min-width` exceeding 320px, and ensure no container has hardcoded widths that force horizontal scroll on 320px width viewports.
*   **T2-F3-02: Large Screen Breakpoint Adaptations**
    *   *Description*: Verify that layout rules adapt for ultra-wide screen widths (e.g., screens above 1440px or 1920px).
    *   *Verification*: Search CSS for media queries like `@media (min-width: 1440px)` or `@media (min-width: 1536px)`.
*   **T2-F3-03: Text Overflows and Word Wraps**
    *   *Description*: Verify that long header labels or product titles do not clip or overflow on mobile screens.
    *   *Verification*: Check CSS for word-wrap, overflow-wrap, and text-ellipsis properties on headers.
*   **T2-F3-04: Navigation Bar Flex wrap / Collapsing**
    *   *Description*: Verify that navigation items collapse to hamburger menu exactly at the breakpoint.
    *   *Verification*: Verify that the media queries in CSS for the navbar collapse happen at or above `1024px` or `1280px` (or `1340px` as seen in current code).
*   **T2-F3-05: Absolute Positioning Overflow Checks**
    *   *Description*: Verify that absolute positioned decorative elements (if any remain) do not cause horizontal scrolling on mobile viewports.
    *   *Verification*: Ensure any absolute-positioned decorative elements use `overflow: hidden` on their parent containers.

---

### 3.3 Tier 3: Cross-Feature Combinations (3 cases)
Validates interactions between different features to ensure visual regression safety.

*   **T3-X-01: Card Style and Orb Absence (F1 + F2)**
    *   *Description*: Verify that the product cards (`.pc-luxe`) have the new organic rounding (F2) AND completely lack the 3D card tilt and hover shimmers (F1).
    *   *Verification*: Parse `.pc-luxe` styles and check that `border-radius` is `2rem`/`3rem` and border color is `rgba(246, 239, 224, 0.08)` (F2) AND check that `.pc-luxe:hover` or `.tilt-card` has no `transform` rotations or `::after` shimmer rules (F1).
*   **T3-X-02: Section Divider Colors and Mobile Breakpoints (F2 + F3)**
    *   *Description*: Verify that section dividers maintain their 2D solid `rgba(246, 239, 224, 0.08)` color (F2) across all responsive breakpoints (F3).
    *   *Verification*: Check that the border style for dividers is uniform in both base styles and responsive media queries, and does not revert to gold gradients or different styles on mobile.
*   **T3-X-03: Mobile Header Layout without Custom Cursors (F1 + F3)**
    *   *Description*: Verify that the mobile header hamburger menu and SideDrawer (F3) do not initialize or attach listeners for custom cursors (F1).
    *   *Verification*: Verify that the JS bundle does not attach event listeners like `mousemove` for custom cursors on mobile menu toggle, preventing performance overhead on touch devices.

---

### 3.4 Tier 4: Real-World Application Scenarios (7 cases)
Verifies end-to-end user journeys and flows.

*   **T4-APP-01: B2C Premium Product Discovery Journey**
    *   *Description*: A consumer visits the homepage, browses product categories, views a product card, and opens the product details.
    *   *Verification*:
        1. Homepage renders using serif headers (`Playfair Display`) and sans-serif body (`Inter`) without gradient orbs or particle canvases.
        2. Category cards have organic rounding (`2rem` to `3rem`) and fine borders.
        3. Product cards have solid fine borders (`1px solid rgba(246, 239, 224, 0.08)`), organic rounding, and do not trigger 3D tilt or glowing borders on hover.
*   **T4-APP-02: B2B/Wholesale Sourcing Portal Inquiry Flow**
    *   *Description*: A B2B trade buyer visits the wholesale section, reviews the partner trust signals/certifications, and submits an inquiry.
    *   *Verification*:
        1. Certifications badges (OEKO-TEX, LGA, etc.) are styled with organic rounding capsule chips (`2rem`/`3rem` or full capsules) and solid fine borders.
        2. Wholesale pricing tables and forms use serif headers for section titles and sans-serif text for form labels.
        3. Inputs and buttons in the inquiry form use the new premium styling (rounding `2rem` to `3rem`, `1px solid rgba(246, 239, 224, 0.08)` borders).
*   **T4-APP-03: Mobile Device Sourcing Sinks and Responsive Layouts**
    *   *Description*: A user visits the website on a mobile device (320px viewport width) to verify layout integrity and navigation.
    *   *Verification*:
        1. No horizontal scroll is present on the document body (`html`/`body` viewport rules).
        2. Desktop navbar is hidden, and the hamburger menu button is displayed.
        3. Tapping the hamburger button slides in the `SideDrawer` navigation, displaying the menu links clearly without text overlaps or truncation.
*   **T4-APP-04: Dark Mode Theme Switcher Interaction**
    *   *Description*: A user toggles between Light and Dark mode to verify theme styling rules.
    *   *Verification*:
        1. When theme is switched, styles update without injecting any gradient orbs or glow effects.
        2. The borders and dividers maintain their solid `rgba(246, 239, 224, 0.08)` color (which is visible and elegant in both themes, especially on dark backgrounds).
        3. Typography font-families remain consistent in both dark and light modes.
*   **T4-APP-05: Checkout and Sourcing Inquiry Submission Success Screen**
    *   *Description*: A buyer adds natural latex bedding to their cart/inquiry list and completes the inquiry process, viewing the success message.
    *   *Verification*:
        1. The success modal/alert-dialog is displayed with organic rounding (`2rem` to `3rem`) and a solid fine border.
        2. Success text utilizes sans-serif (`Inter`) for readability, and headers use serif (`Playfair Display`).
        3. No ambient glowing or flashing shadows are present around the modal.
*   **T4-APP-06: About Page Partner Validation Sinks**
    *   *Description*: A buyer visits the About page to verify the supplier details and partner validation.
    *   *Verification*:
        1. Official partner badge is displayed with solid fine borders and organic rounding.
        2. Sourcing credentials and documents sections are styled using serif headers and sans-serif descriptions.
        3. No gradient sweeps, glow outlines, or 3D cards are present in the sourcing section.
*   **T4-APP-07: Admin Dashboard Styling Check**
    *   *Description*: An administrator logs into the admin panel (`/xiyora-admin`) and inspects the panel layouts.
    *   *Verification*:
        1. The admin panel forms, tables, and buttons respect the 2D layout borders (`rgba(246, 239, 224, 0.08)`).
        2. Form inputs are styled with organic roundings of `2rem` to `3rem` and no AI-template style residues are visible.
        3. Layout remains responsive without side scrolling.

---

## 4. Responsiveness Verification Mechanisms

Verification of mobile responsiveness is performed through a combined static analysis of CSS media queries and HTML/JSX responsive class utility analysis.

### 4.1 HTML Viewport Integrity Check
The test suite ensures the viewport meta tag is correctly defined in the document head:
```typescript
function verifyViewportMeta(html: string): boolean {
  const viewportRegex = /<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i;
  const match = html.match(viewportRegex);
  if (!match) return false;
  
  const content = match[1];
  return content.includes('width=device-width') && content.includes('initial-scale=1');
}
```

### 4.2 CSS Media Query Validation
The parser scans CSS for critical responsive breakpoints (e.g. `@media (max-width: 560px)`, `@media (max-width: 768px)`, `@media (max-width: 1024px)`, `@media (max-width: 1340px)`) to ensure mobile layout overrides are present.
It verifies:
1. **Layout Stack Rules**: Layout grids like `.stats-grid`, `.biz-grid`, `.lux-hero-grid` must collapse to single columns (`grid-template-columns: 1fr`) inside mobile breakpoints.
2. **Horizontal Scroll Prevention**: It scans for any styling declarations setting fixed widths (e.g., `width: 500px`) in base rules, and asserts that they are replaced by responsive widths (`width: 100%`) or `max-width` overrides inside media queries.

```typescript
function verifyMobileLayoutOverrides(rules: CSSRule[]): boolean {
  // Find all mobile media queries (max-width <= 768px)
  const mobileRules = rules.filter(r => r.mediaQuery && r.mediaQuery.includes('max-width'));
  
  // Verify that grids are set to 1 column on mobile
  const hasGridCollapse = mobileRules.some(r => 
    (r.selector.includes('.stats-grid') || r.selector.includes('.biz-grid') || r.selector.includes('.lux-hero-grid')) &&
    r.declarations['grid-template-columns'] === '1fr'
  );
  
  return hasGridCollapse;
}
```

### 4.3 Responsive Utility Class Checker
Tailwind CSS v4 injects utility classes directly. The parser checks the compiled JS bundle or source files for the presence of responsive prefixes.
Specifically, it checks that structural tags contain:
- `sm:` (e.g. `sm:grid-cols-2`)
- `md:` (e.g. `md:flex-row`)
- `lg:` (e.g. `lg:max-w-7xl`)

```typescript
function verifyTailwindResponsiveClasses(jsContent: string): boolean {
  // Regex looking for tailwind responsive utility class usage in JSX/JS
  const responsivePrefixRegex = /\b(sm|md|lg|xl|2xl):[a-z0-9-]+/i;
  return responsivePrefixRegex.test(jsContent);
}
```

### 4.4 Hamburger Menu Visibility Rules
The parser verifies that the hamburger button is hidden on desktop viewports and visible on mobile viewports:
```typescript
function verifyHamburgerMenuRules(rules: CSSRule[]): boolean {
  // 1. Desktop state (should be hidden)
  const desktopHamburgerRule = rules.find(r => r.selector === '.nav-hamburger' && !r.mediaQuery);
  const isDesktopHidden = desktopHamburgerRule && desktopHamburgerRule.declarations['display'] === 'none';

  // 2. Mobile state (should be visible below 1340px or similar)
  const mobileHamburgerRule = rules.find(r => r.selector === '.nav-hamburger' && r.mediaQuery && r.mediaQuery.includes('max-width'));
  const isMobileVisible = mobileHamburgerRule && 
    (mobileHamburgerRule.declarations['display'] === 'block' || mobileHamburgerRule.declarations['display'] === 'flex');

  return !!(isDesktopHidden && isMobileVisible);
}
```

---

## 5. Verification & Execution Method

To independently execute and verify the E2E test suite:
1. Build the production assets of the workspace:
   ```bash
   pnpm run build
   ```
2. Run the test script using `tsx` (TypeScript Execution Engine) from the project root:
   ```bash
   npx tsx scripts/e2e-test.ts
   ```
3. **Invalidation conditions**: The tests will fail if:
   * Any legacy small border-radius values are found on premium elements.
   * Background gradient orbs, trailing cursors, canvas components, sakura overlays, or 3D cards are present in the bundle.
   * Media queries are missing, or layout widths exceed the safe limits.
   * The test suite will log detailed failure messages with the target rule or line number on mismatch.
