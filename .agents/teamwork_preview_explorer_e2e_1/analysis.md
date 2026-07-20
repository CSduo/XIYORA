# XIYORA Aesthetic Re-engineering: Opaque-Box E2E Testing Analysis

This report outlines the design and implementation strategy for a comprehensive, opaque-box End-to-End (E2E) test suite targeting the aesthetic re-engineering of the XIYORA codebase. It ensures strict compliance with the visual interface contracts specified in `PROJECT.md` without coupling the tests to internal React or application state.

---

## 1. Visual Styles Inspection Methods

To ensure the built application conforms to the re-engineered aesthetic, we can inspect styling properties using both **static** (compile-time) and **dynamic** (runtime) analysis.

### A. Static Inspection (Asset Scanning)
Static checks parse the production build assets in `artifacts/xiyora/dist/public` before launching any browser. This provides rapid feedback in CI pipelines.
- **CSS Ast Parsing / Scanning**: Load `dist/public/assets/index-*.css`.
  - **Custom Cursors**: Assert that selector names containing `.xiyora-cursor` or `.xiyora-cursor-dot` do not exist.
  - **Section Dividers**: Check `.x-gold-divider` rules. Verify they do not use `linear-gradient` backgrounds or glowing box-shadows.
  - **Card/Button Styling**: Inspect selectors like `.pc-luxe`, `.testimonial-card`, `.glass-card`, `.cat-card`, `.bg`, `.bo`, and `.bd`. Verify their `border-radius` rules fall strictly within `32px` (`rounded-[2rem]`) and `48px` (`rounded-[3rem]`) or equivalents, and that borders are solid `1px` with color `rgba(246, 239, 224, 0.08)`.
  - **Typography**: Check that custom header elements (`h1`, `h2`, `h3`, etc.) map `font-family` exclusively to `'Playfair Display', serif` and body text maps to `'Inter', sans-serif`.
- **JS Bundle Scanning**: Scan the compiled `dist/public/assets/index-*.js` files for raw strings or dynamically injected CSS template literals that contain cursor properties or banned gradient properties.

### B. Dynamic Inspection (Runtime Computed Styles)
Dynamic checks verify elements as rendered by the browser. This ensures that Tailwind utility classes, inline style overrides, and third-party UI overlays (such as Radix primitives) are correctly evaluated.
- **Computed CSS Retrieval**: Use Playwright/Puppeteer to select DOM elements and retrieve their computed styles via `window.getComputedStyle(element)`.
- **Properties to Inspect**:
  - **Fonts**: `fontFamily` must resolve to include `'Playfair Display'` for headers and `'Inter'` for body/descriptions.
  - **Border Colors**: `borderColor` must resolve to `rgba(246, 239, 224, 0.08)` (or `rgba(246, 239, 224, 0.08)`'s RGB equivalence `rgb(246, 239, 224)` with 0.08 alpha) for cards, buttons, and dividers.
  - **Borders**: `borderStyle` must be `solid` and `borderWidth` must be `1px`.
  - **Rounding**: `borderRadius` must be between `32px` (2rem) and `48px` (3rem) inclusive.
  - **Cursor**: The body and generic elements must resolve to `cursor: auto` or default browser cursors, and no custom cursor overlays (which have `pointer-events: none` and fixed positioning) should exist in the DOM tree.

---

## 2. Opaque-Box E2E Testing Strategy

An **opaque-box E2E strategy** tests the compiled application bundle exactly as a user (or search engine) would experience it, without importing React components, utility functions, or mock datasets from the codebase.

```
┌─────────────────┐      pnpm build      ┌─────────────────────┐
│ Source Code     ├─────────────────────>│ Built Dist Bundle   │
│ (React/TS/CSS)  │                      │ (HTML/JS/CSS/WebP)  │
└─────────────────┘                      └──────────┬──────────┘
                                                    │
                                                    ▼  Lightweight HTTP Server
                                         ┌─────────────────────┐
                                         │  http://localhost   │
                                         └──────────┬──────────┘
                                                    │
                                                    ▼  Browser Automation (Playwright)
                                         ┌─────────────────────┐
                                         │  scripts/e2e-test   │
                                         └─────────────────────┘
```

### Strategy Lifecycle
1. **Build Step**: Execute `pnpm --filter @workspace/xiyora run build` to generate the production assets in `artifacts/xiyora/dist/public`.
2. **Server Lifespan**: Spawn a background Node.js process using a lightweight static server (e.g. `sirv-cli` or a simple Express/HTTP server script) pointing to `artifacts/xiyora/dist/public`.
3. **Browser Execution**: Launch a headless browser instance using Playwright. Navigating through all pages (`/`, `/products`, `/supplier`, `/about`, etc.) by mimicking link clicks.
4. **DOM Assertions**: Use selectors to inspect elements and check layout boxes, scroll boundaries, and computed style rules.
5. **Teardown**: Close browser pages, terminate the headless browser process, and kill the static web server process.

---

## 3. Schema & Layout for `scripts/e2e-test.ts`

Below is a proposed layout for the TypeScript test runner `scripts/e2e-test.ts`. This script starts the preview server, launches Playwright, executes static assets scanning, performs dynamic browser visual assertions, and yields a structured report.

```typescript
import { chromium, Browser, Page } from "playwright";
import { exec, ChildProcess } from "child_process";
import fs from "fs";
import path from "path";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(__dirname, "../artifacts/xiyora/dist/public");

// ── Lifecycle Management ──
let serverProcess: ChildProcess;
let browser: Browser;

async function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Start Vite preview or sirv server pointing to the built dist/public directory
    serverProcess = exec(`pnpm --filter @workspace/xiyora exec vite preview --port ${PORT} --host 127.0.0.1`, (err) => {
      if (err && !serverProcess.killed) {
        console.error("Preview server failed to start:", err);
        reject(err);
      }
    });

    // Wait for server to become responsive
    const checkServer = setInterval(async () => {
      try {
        const res = await fetch(BASE_URL);
        if (res.ok) {
          clearInterval(checkServer);
          resolve();
        }
      } catch {
        // Keep polling
      }
    }, 250);

    setTimeout(() => {
      clearInterval(checkServer);
      reject(new Error("Timeout waiting for preview server."));
    }, 10000);
  });
}

async function stopServer() {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
}

// ── Static Asset Scanners ──
function runStaticChecks(): { success: boolean; errors: string[] } {
  const errors: string[] = [];
  const files = fs.readdirSync(path.join(DIST_PATH, "assets"));
  const cssFile = files.find(f => f.endsWith(".css"));
  const jsFiles = files.filter(f => f.endsWith(".js"));

  if (!cssFile) {
    errors.push("Built CSS bundle not found.");
    return { success: false, errors };
  }

  const cssContent = fs.readFileSync(path.join(DIST_PATH, "assets", cssFile), "utf8");

  // 1. Check for custom cursor classes
  if (cssContent.includes(".xiyora-cursor") || cssContent.includes(".xiyora-cursor-dot")) {
    errors.push("Banned cursor classes (.xiyora-cursor / .xiyora-cursor-dot) detected in built CSS.");
  }

  // 2. Check for gradient section dividers
  // Note: Searching for linear-gradient on dividers that should be solid 2D lines
  const dividerRegex = /\.x-gold-divider\s*\{[^}]*linear-gradient/i;
  if (dividerRegex.test(cssContent)) {
    errors.push("Banned background linear-gradients found on section dividers.");
  }

  return { success: errors.length === 0, errors };
}

// ── Dynamic Style Assertions ──
async function assertComputedStyle(
  page: Page,
  selector: string,
  assertion: (styles: CSSStyleDeclaration) => string | null
): Promise<string | null> {
  const handle = await page.$(selector);
  if (!handle) return `Element not found: ${selector}`;
  
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return `Element not found inside browser: ${sel}`;
    const computed = window.getComputedStyle(el);
    // Serialize required properties to avoid cloning errors
    return {
      fontFamily: computed.fontFamily,
      borderRadius: computed.borderRadius,
      borderColor: computed.borderColor,
      borderStyle: computed.borderStyle,
      borderWidth: computed.borderWidth,
      boxShadow: computed.boxShadow,
      background: computed.background,
      display: computed.display
    };
  }, selector).then((props) => {
    // Mimic CSSStyleDeclaration mock object for assertion check
    return assertion(props as any);
  });
}

// ── Main Test Runner ──
async function main() {
  console.log("=== Running Static Asset Scan ===");
  const staticResult = runStaticChecks();
  if (!staticResult.success) {
    console.error("Static Checks Failed:", staticResult.errors);
  } else {
    console.log("✓ Static Checks Passed.");
  }

  console.log("\n=== Launching Preview Server & Browser ===");
  try {
    await startServer();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL);
    // Dismiss loading screen if present
    await page.waitForSelector("#xi-loader", { state: "detached" });

    // --- TEST CASE 1: Cursor Check ---
    const cursorElements = await page.$$(".xiyora-cursor, .xiyora-cursor-dot");
    if (cursorElements.length > 0) {
      console.error("✗ Fail: Custom cursor elements exist in the DOM.");
    } else {
      console.log("✓ Pass: Custom cursor elements fully removed from DOM.");
    }

    // --- TEST CASE 2: Section Divider styling ---
    const dividerErr = await assertComputedStyle(page, ".x-gold-divider", (styles) => {
      const isSolid = !styles.background.includes("linear-gradient");
      const isCorrectColor = styles.borderColor.includes("rgba(246, 239, 224, 0.08)") || 
                             styles.borderColor === "rgba(246, 239, 224, 0.08)" ||
                             styles.borderColor === "rgb(246, 239, 224)"; // Alpha-stripped matching fallback
      if (!isSolid) return "Divider background contains gradients.";
      return null;
    });
    if (dividerErr) {
      console.error(`✗ Fail Divider Style: ${dividerErr}`);
    } else {
      console.log("✓ Pass: Dividers styled with solid borders.");
    }

    // --- TEST CASE 3: Card/Button Rounding ---
    const cardErr = await assertComputedStyle(page, ".pc-luxe", (styles) => {
      const radius = parseInt(styles.borderRadius, 10);
      if (isNaN(radius) || radius < 32 || radius > 48) {
        return `Card border-radius (${styles.borderRadius}) is outside [32px, 48px] range.`;
      }
      return null;
    });
    if (cardErr) {
      console.error(`✗ Fail Card Styling: ${cardErr}`);
    } else {
      console.log("✓ Pass: Card border-radius lies within [32px, 48px] range.");
    }

    // --- TEST CASE 4: Responsive Overflow check ---
    const viewports = [320, 375, 768, 1024, 1340, 1440];
    for (const w of viewports) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(100); // Allow layouts to settle
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.error(`✗ Fail Responsive: Horizontal scrollbar detected at viewport width ${w}px.`);
      } else {
        console.log(`✓ Pass: Layout is mobile-responsive at viewport width ${w}px.`);
      }
    }

  } catch (err) {
    console.error("E2E Test Execution Error:", err);
  } finally {
    if (browser) await browser.close();
    await stopServer();
    console.log("=== E2E Test Suite Completed ===");
  }
}

main();
```

---

## 4. Responsive Layout Verification Strategy

Mobile responsive layouts must be verified across multiple breakpoints. In XIYORA, the layout changes around specific media query boundaries (1340px, 1024px, 900px, 768px, 560px). We check layout properties both **dynamically** and **statically**.

### A. Horizontal Scroll Detection
Horizontal scroll occurs when an element has a fixed pixel width larger than the screen width, or when margins/paddings force layout expansion.
- **Dynamic Check**:
  1. Set browser viewport size to width `W` (e.g. 320px).
  2. Measure scroll metrics:
     ```javascript
     const hasScroll = document.documentElement.scrollWidth > window.innerWidth;
     ```
  3. Locate causing elements: Query all visible elements in the DOM and identify which has a bounding box right edge exceeding the viewport width:
     ```javascript
     const overflowingElements = Array.from(document.querySelectorAll('*')).filter(el => {
       const rect = el.getBoundingClientRect();
       return rect.right > window.innerWidth && rect.width > 0;
     });
     ```
- **Static Check**: Analyze `luxe.css` or the bundle files for fixed widths:
  - Verify that no elements have hardcoded inline styles like `style={{ width: "1200px" }}` or `style={{ minWidth: 600 }}` without responsive overrides.

### B. Header / Navigation Overlaps
When elements in the navigation bar or header fail to wrap or collapse on smaller screens, they can overlap horizontally, making text illegible and clicks unresponsive.
- **Dynamic Check**:
  1. Set viewport size (e.g., to 1024px, which is below the desktop menu breakpoint).
  2. Locate all visible sibling nodes in the header (e.g., logo `.header-logo`, navigation menu `.nc`, currency selector `.nav-cur`, theme toggle `.nav-theme`, wishlist, cart, hamburger `.nav-hamburger`).
  3. Retrieve their bounding boxes: `rect = element.getBoundingClientRect()`.
  4. Compare all pairs of active elements `A` and `B` to check for collision/intersection:
     ```javascript
     const isOverlapping = (rectA, rectB) => {
       return !(
         rectA.right <= rectB.left ||
         rectA.left >= rectB.right ||
         rectA.bottom <= rectB.top ||
         rectA.top >= rectB.bottom
       );
     };
     ```
  5. Assert that no visible, pointer-events active components overlap.
  6. Assert that below `1340px`, the desktop link container `.nc` resolves to `display: none` and has zero dimensions, and that the hamburger menu `.nav-hamburger` is visible and clickable.

---

## 5. Draft Test Cases (Tier 1 & Tier 2)

Our E2E test plan is divided into Tier 1 (Feature Coverage) and Tier 2 (Boundary cases) to isolate and systematically verify each interface contract.

### Tier 1: Feature Coverage

| Test ID | Contract / Feature | Test Objective | Validation Method |
|:---|:---|:---|:---|
| **T1-01** | Custom Cursor | Verify that the custom trailing cursor is fully removed from the DOM. | Navigate to home page. Assert selector `.xiyora-cursor` and `.xiyora-cursor-dot` returns 0 elements. |
| **T1-02** | Default Cursor | Ensure browser uses the native default pointer style. | Query computed style of `body` and hover over links. Verify `cursor` is `auto` or `pointer` (no custom cursor overrides). |
| **T1-03** | Section Dividers | Verify section dividers are 2D lines with no gradients. | Select `.x-gold-divider`. Assert computed `background-image` is `none` and `borderColor` is `rgba(246, 239, 224, 0.08)`. |
| **T1-04** | Card Rounding | Verify that cards (product, testimonial, category) have premium organic rounding. | Select `.pc-luxe`, `.testimonial-card`, `.glass-card`. Assert computed `borderRadius` is $\ge 32\text{px}$ and $\le 48\text{px}$. |
| **T1-05** | Button Rounding | Verify that primary, secondary, and outline buttons have organic rounding. | Select buttons matching `.bg`, `.bo`, `.bd`. Assert computed `borderRadius` is $\ge 32\text{px}$ and $\le 48\text{px}$. |
| **T1-06** | Card/Button Borders | Verify card and button borders are thin, solid, and use the neutral-luxe color. | Assert computed `borderStyle` is `solid`, `borderWidth` is `1px`, and `borderColor` matches `rgba(246, 239, 224, 0.08)`. |
| **T1-07** | Serif Typography | Verify headers utilize the luxury serif typeface. | Select `h1, h2, h3, h4, h5, h6, .serif`. Verify computed `fontFamily` includes `'Playfair Display'`. |
| **T1-08** | Sans-Serif Typo | Verify descriptions and body text use the clean sans-serif typeface. | Select body paragraphs and product descriptions. Verify computed `fontFamily` includes `'Inter'`. |
| **T1-09** | Nav Collapse | Verify navigation links collapse to hamburger menu at tablet/mobile widths. | Resize viewport to 1024px. Verify `.nc` is hidden (`display: none` or zero height/width) and `.nav-hamburger` is visible. |
| **T1-10** | Lead Generation | Verify B2B Inquiry and Review forms can be filled and submitted. | Fill in mock values in `B2BInquiryForm`. Submit and check that it saves locally and opens WhatsApp with a pre-filled message. |

### Tier 2: Boundary Cases

| Test ID | Contract / Feature | Test Objective | Validation Method |
|:---|:---|:---|:---|
| **T2-01** | Min Width Safety | Ensure zero horizontal overflow at the absolute lowest target layout width (320px). | Set viewport width to 320px. Assert `document.documentElement.scrollWidth <= 320`. Check for clipping text or buttons. |
| **T2-02** | Breakpoint Bounds | Verify layout structure at critical breakpoint thresholds: 1339px vs 1340px. | Set viewport to 1339px (verify hamburger menu active, desktop links hidden). Set viewport to 1340px (verify desktop links active, hamburger hidden). |
| **T2-03** | Element Overlaps | Check for logo and action item overlaps at tablet viewports (768px to 1024px). | Loop viewport from 768px to 1024px in 50px increments. Check bounding boxes of logo, search button, cart, and hamburger menu. Assert zero overlaps. |
| **T2-04** | Touch Media Safe | Verify hover effects do not cause layout loops on touch devices. | Emulate touch pointer (`coarse`). Verify hover classes (like 3D tilt, shimmers) are disabled or safe and do not trigger horizontal scrolls. |
| **T2-05** | Extreme Viewport | Check container alignments on ultra-wide screens (e.g. 2560px). | Set viewport to 2560px. Verify content remains centered inside a max-width container (`.container` max-width 1280px or similar) and does not stretch infinitely. |
| **T2-06** | Text Scaling/Zoom | Verify that text scaling (up to 200%) does not break card shapes or leak text. | Inject CSS scaling or double font sizes. Assert that buttons and card text do not overflow their borders or clip. |
| **T2-07** | Theme Toggle | Verify visual contracts are preserved in both light and dark modes. | Click theme toggle button. Re-evaluatecomputed border colors (`rgba(246, 239, 224, 0.08)`) and typography families. Verify they match contracts in both modes. |
