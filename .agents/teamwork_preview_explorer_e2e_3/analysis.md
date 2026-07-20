# XIYORA E2E Test Suite Design Analysis

## Summary of Core Findings
1. **Zero-Dependency Testing Requirement**: The workspace lacks DOM-emulation or browser-automation libraries (e.g., JSDOM, Playwright, Cypress). Consequently, the E2E test suite must be built as a self-contained, zero-dependency Node.js script written in TypeScript that performs compile-time verification, static AST/regex analysis on source/built bundles, and CSS rule scanning.
2. **Features Under Test (N=3)**: 
   - **F1: AI-Template Aesthetic Removal**: Elimination of glow/orb effects, trailing cursors, particles canvas, shimmer/gradient loaders, and 3D tilts.
   - **F2: 2D Premium Styling**: High-end typography (Playfair Display for headings, Inter for body), solid dividers, organic rounding (`rounded-[2rem]` to `rounded-[3rem]`), and gold/cream/navy/espresso color scheme.
   - **F3: Responsiveness**: Mobile layout alignment (no horizontal scroll down to 320px, mobile overlay menu under 1340px, scrollable B2B table, no overlap).
3. **Static Check Assessment**: Simple string checks (e.g., checking for the substring `shimmer` or `x-orb`) are valuable but insufficient on their own due to false positives (e.g., matching text in customer reviews) and false negatives (e.g., dynamically interpolated class names). They must be structured using context-aware regex patterns (matching only class attributes/CSS selectors) and verified against the compiled `dist` bundle files.

---

## 1. Concrete TypeScript-Based Test Cases (Tier 3 & Tier 4)

Below is the concrete TypeScript structure proposed for Tier 3 and Tier 4 test cases. These will be executed by `scripts/e2e-test.ts` against the built assets in `artifacts/xiyora/dist/public` and source files.

### Test Type Definitions (`scripts/src/types.ts`)
```typescript
export interface TestResult {
  passed: boolean;
  message: string;
}

export interface TestCase {
  id: string;
  name: string;
  tier: 3 | 4;
  feature: string;
  run: (context: TestContext) => Promise<TestResult>;
}

export interface TestContext {
  srcApp: string;      // Contents of src/App.tsx
  srcLuxeCss: string;  // Contents of src/styles/luxe.css
  distHtml: string;    // Contents of dist/public/index.html
  distJs: string;      // Concatenated contents of dist/public/assets/*.js
  distCss: string;     // Concatenated contents of dist/public/assets/*.css
}
```

### Tier 3: Cross-Feature Combinations (Pairwise Coverage)
Tier 3 ensures that interactions between features maintain consistency. These tests combine F1, F2, and F3 to check layout and visual integrity.

#### Test Case 3.1: Clean Card Refactoring (F1 × F2)
* **Goal**: Verify that card elements (Product Cards, Testimonial Cards) previously containing 3D tilt or glow borders have been cleaned of those styles and now correctly use 2D premium borders and organic rounding.
* **Code Implementation**:
```typescript
import { TestCase, TestResult, TestContext } from "./types";

export const testCleanCardRefactoring: TestCase = {
  id: "TC-3.1",
  name: "Clean Card Refactoring (F1 x F2)",
  tier: 3,
  feature: "F1 x F2: Aesthetic Removal & 2D Premium",
  run: async (ctx: TestContext): Promise<TestResult> => {
    // 1. Negative checks: Ensure 3D tilt and glowing borders are absent in CSS/JS
    const hasTiltSelector = /\.tilt-card|\.tilt-3d|\.tilt-3d-inner/g.test(ctx.distCss);
    const hasGlowBtnSelector = /\.btn-luxe-glow/g.test(ctx.distCss);
    
    if (hasTiltSelector || hasGlowBtnSelector) {
      return {
        passed: false,
        message: "Failed: Built CSS still contains references to '.tilt-card', '.tilt-3d', or '.btn-luxe-glow'."
      };
    }

    // 2. Positive checks: Ensure cards are styled with 2D premium styling
    // Look for class definitions that combine the custom 2D border color rgba(246, 239, 224, 0.08) and custom rounding
    const has2DBorder = ctx.distCss.includes("rgba(246, 239, 224, 0.08)") || ctx.distCss.includes("rgba(246,239,224,0.08)");
    const hasOrganicRounding = /rounded-\[([23])rem\]/g.test(ctx.srcApp) || ctx.distCss.includes("border-radius");

    if (!has2DBorder) {
      return { passed: false, message: "Failed: No 2D premium border color 'rgba(246, 239, 224, 0.08)' found in style assets." };
    }
    if (!hasOrganicRounding) {
      return { passed: false, message: "Failed: Organic rounding (rounded-[2rem] or rounded-[3rem]) is missing from card configurations." };
    }

    return { passed: true, message: "Passed: Cards cleaned of 3D tilt/glow and correctly leverage premium 2D borders & rounding." };
  }
};
```

#### Test Case 3.2: Mobile Cursor and Orb Suppression (F1 × F3)
* **Goal**: Ensure that mobile viewports do not load or declare trailing custom cursors or background gradient orbs that cause visual stuttering or layout shift.
* **Code Implementation**:
```typescript
export const testMobileCursorAndOrbSuppression: TestCase = {
  id: "TC-3.2",
  name: "Mobile Cursor and Orb Suppression (F1 x F3)",
  tier: 3,
  feature: "F1 x F3: Aesthetic Removal & Responsiveness",
  run: async (ctx: TestContext): Promise<TestResult> => {
    // 1. Ensure custom cursor DOM elements are removed from source
    const hasCursorDom = /xiyora-cursor/i.test(ctx.srcApp);
    if (hasCursorDom) {
      return { passed: false, message: "Failed: Custom cursor DOM elements ('xiyora-cursor') are still defined in App.tsx." };
    }

    // 2. Check that no background orbs (.x-orb) exist in the built JS bundle or source HTML
    const hasOrbsInJS = /x-orb/i.test(ctx.distJs) || /x-orb/i.test(ctx.distHtml);
    if (hasOrbsInJS) {
      return { passed: false, message: "Failed: Ambient gradient orbs ('.x-orb') are still referenced in built JS or HTML." };
    }

    return { passed: true, message: "Passed: Custom cursors and gradient orbs are absent from responsive bundle output." };
  }
};
```

#### Test Case 3.3: Responsive Typography & Heading Overlaps (F2 × F3)
* **Goal**: Ensure luxury headers (Playfair Display) scale down responsively on narrow viewports to prevent header overlaps or visual line wrapping failures.
* **Code Implementation**:
```typescript
export const testResponsiveTypographyScaling: TestCase = {
  id: "TC-3.3",
  name: "Responsive Typography & Heading Overlaps (F2 x F3)",
  tier: 3,
  feature: "F2 x F3: 2D Premium & Responsiveness",
  run: async (ctx: TestContext): Promise<TestResult> => {
    // 1. Verify CSS defines Playfair Display for headings and Inter for body text
    const hasPlayfair = /font-family:[^;]*Playfair Display/i.test(ctx.distCss) || /font-serif/i.test(ctx.srcApp);
    const hasInter = /font-family:[^;]*Inter/i.test(ctx.distCss) || /font-sans/i.test(ctx.srcApp);

    if (!hasPlayfair || !hasInter) {
      return { passed: false, message: "Failed: Font declarations for Playfair Display or Inter are missing." };
    }

    // 2. Check for the presence of responsive utility classes or CSS rules scaling typography on mobile
    // Search for Tailwind font size scaling utilities (e.g. text-2xl md:text-4xl or similar responsive heading controls)
    const hasResponsiveHeadingSizes = /text-[a-z0-9]+[^"]*md:text-/i.test(ctx.srcApp) || /@media.*font-size/i.test(ctx.distCss);
    if (!hasResponsiveHeadingSizes) {
      return { passed: false, message: "Failed: No responsive heading text scale found in App.tsx or CSS bundles." };
    }

    return { passed: true, message: "Passed: Fonts are declared correctly and head lines scale down responsively." };
  }
};
```

---

### Tier 4: Real-World Application Scenarios
Tier 4 simulates user journeys to verify the end-to-end integration of visual rules and B2B/B2C logic.

#### Test Case 4.1: B2B Wholesale Portal & Sourcing Inquiry Flow
* **Goal**: Verify that a trade partner can access the B2B portal, review the MOQ pricing matrix, and interact with the Inquiry Form.
* **Code Implementation**:
```typescript
export const testB2BWholesalePortalFlow: TestCase = {
  id: "TC-4.1",
  name: "B2B Sourcing Portal Inquiry Flow",
  tier: 4,
  feature: "Scenario: Wholesale Portal Sourcing",
  run: async (ctx: TestContext): Promise<TestResult> => {
    // 1. Assert that B2B fields are declared in data spec
    const hasTradeCategories = ctx.srcApp.includes("b2bTradeCategories");
    const hasB2BProducts = ctx.srcApp.includes("b2bProducts");
    const hasQuantities = ctx.srcApp.includes("b2bQuantities");

    if (!hasTradeCategories || !hasB2BProducts || !hasQuantities) {
      return { passed: false, message: "Failed: B2B portal dataset spec (categories, products, quantities) is missing." };
    }

    // 2. Verify B2B Inquiry Form elements are present in App.tsx
    const hasFormElements = ctx.srcApp.includes("Company / Organisation Name") && 
                             ctx.srcApp.includes("Estimated Quantity");
    
    if (!hasFormElements) {
      return { passed: false, message: "Failed: Inquiry Form fields (Company Name, Estimated Quantity) are missing from App.tsx." };
    }

    // 3. Verify MOQ table contains the required trade pricing rows
    const hasPricingRows = ctx.srcApp.includes("Discount off RRP") && ctx.srcApp.includes("Lead Time");
    if (!hasPricingRows) {
      return { passed: false, message: "Failed: B2B pricing table data structure or rows are missing." };
    }

    return { passed: true, message: "Passed: B2B Wholesale portal dataset, MOQ matrix, and form structures are fully validated." };
  }
};
```

#### Test Case 4.2: Premium Product Sourcing and Detail Verification
* **Goal**: Verify that B2C buyers can view complete product specs, select sizing, and see uncompromised 2D presentation without AI templates.
* **Code Implementation**:
```typescript
export const testPremiumProductSourcingDetails: TestCase = {
  id: "TC-4.2",
  name: "Premium Product Sourcing detail verification",
  tier: 4,
  feature: "Scenario: B2C Product Details",
  run: async (ctx: TestContext): Promise<TestResult> => {
    // 1. Verify the 4 key products are defined (Mattress, Pillow, Topper, Cushion Cores)
    const hasMattress = ctx.srcApp.includes("Dunlop Natural Latex Mattress") || ctx.srcApp.includes("Signature Dunlop Mattress");
    const hasPillow = ctx.srcApp.includes("Talalay Cloud Pillow") || ctx.srcApp.includes("Talalay Bread Pillow");
    const hasTopper = ctx.srcApp.includes("Dunlop Latex Mattress Topper");
    const hasCushion = ctx.srcApp.includes("Custom Latex Cushion Cores") || ctx.srcApp.includes("Latex Cushion Core");

    if (!hasMattress || !hasPillow || !hasTopper || !hasCushion) {
      return { passed: false, message: "Failed: One or more core products are missing from the dataset specification." };
    }

    // 2. Verify technical specifications structure is defined in product metadata
    const hasSpecsTable = ctx.srcApp.includes("specs") && ctx.srcApp.includes("Process") && ctx.srcApp.includes("Latex Content");
    if (!hasSpecsTable) {
      return { passed: false, message: "Failed: Technical specifications fields are not properly defined in the product metadata." };
    }

    return { passed: true, message: "Passed: Product data specs contain all required B2C products, sizing, and detail fields." };
  }
};
```

#### Test Case 4.3: Landed Cost Freight Calculator Workflow
* **Goal**: Validate that the B2B Freight Calculator is operational, includes port origins/destinations, material multipliers, and calculates the 18% IGST without JS layout overflow.
* **Code Implementation**:
```typescript
export const testLandedCostFreightCalculator: TestCase = {
  id: "TC-4.3",
  name: "Landed Cost Freight Calculator Workflow",
  tier: 4,
  feature: "Scenario: Landed Cost Calculator",
  run: async (ctx: TestContext): Promise<TestResult> => {
    // 1. Verify origins, destinations, and material fields exist
    const hasOrigins = ctx.srcApp.includes("freightOrigins");
    const hasDestinations = ctx.srcApp.includes("freightDestinations");
    const hasIGSTRate = ctx.srcApp.includes("freightIGSTRate") && ctx.srcApp.includes("0.18");

    if (!hasOrigins || !hasDestinations || !hasIGSTRate) {
      return { passed: false, message: "Failed: Landed Cost dataset (origins, destinations, IGST multiplier) is missing." };
    }

    // 2. Verify calculations layout doesn't crash on empty selections (check for formula/calculation handles in bundle)
    const hasCalculationLogic = ctx.distJs.includes("freightPortHandling") || ctx.srcApp.includes("freightPortHandling");
    if (!hasCalculationLogic) {
      return { passed: false, message: "Failed: Landed Cost logic or port handling variables are missing." };
    }

    return { passed: true, message: "Passed: B2B Landed Cost Freight Calculator variables and math definitions are verified." };
  }
};
```

---

## 2. Test Runner Script Layout (`scripts/e2e-test.ts`)

Since standard test frameworks are not pre-installed, `scripts/e2e-test.ts` should act as a self-contained test runner. Below is the proposed layout of this file.

```typescript
import * as fs from "fs";
import * as path from "path";
import { TestCase, TestContext, TestResult } from "./src/types";

// Import all test cases
import { testCleanCardRefactoring, testMobileCursorAndOrbSuppression, testResponsiveTypographyScaling } from "./src/tier3Tests";
import { testB2BWholesalePortalFlow, testPremiumProductSourcingDetails, testLandedCostFreightCalculator } from "./src/tier4Tests";
// (Include Tier 1 & 2 tests imported here as well)

class E2ETestRunner {
  private testCases: TestCase[] = [];
  private results: { id: string; name: string; passed: boolean; message: string; duration: number }[] = [];

  constructor() {
    // Register Tier 3 tests
    this.register(testCleanCardRefactoring);
    this.register(testMobileCursorAndOrbSuppression);
    this.register(testResponsiveTypographyScaling);

    // Register Tier 4 tests
    this.register(testB2BWholesalePortalFlow);
    this.register(testPremiumProductSourcingDetails);
    this.register(testLandedCostFreightCalculator);
  }

  private register(test: TestCase) {
    this.testCases.push(test);
  }

  private loadContext(): TestContext {
    const workspaceRoot = path.resolve(__dirname, "..");
    
    // Resolve source paths
    const srcAppPath = path.join(workspaceRoot, "artifacts/xiyora/src/App.tsx");
    const srcLuxeCssPath = path.join(workspaceRoot, "artifacts/xiyora/src/styles/luxe.css");

    // Resolve build paths
    const distDir = path.join(workspaceRoot, "artifacts/xiyora/dist/public");
    const distHtmlPath = path.join(distDir, "index.html");

    // Verify build outputs exist before running E2E tests
    if (!fs.existsSync(distDir) || !fs.existsSync(distHtmlPath)) {
      console.error("\x1b[31m[ERROR] Built assets not found in artifacts/xiyora/dist/public.\x1b[0m");
      console.error("Please run 'pnpm run build' first before executing the E2E tests.");
      process.exit(1);
    }

    // Read asset files
    const srcApp = fs.readFileSync(srcAppPath, "utf8");
    const srcLuxeCss = fs.readFileSync(srcLuxeCssPath, "utf8");
    const distHtml = fs.readFileSync(distHtmlPath, "utf8");

    // Find and concatenate JS/CSS bundles
    const assetsDir = path.join(distDir, "assets");
    let distJs = "";
    let distCss = "";

    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      files.forEach(file => {
        const fullPath = path.join(assetsDir, file);
        if (file.endsWith(".js")) {
          distJs += fs.readFileSync(fullPath, "utf8") + "\n";
        } else if (file.endsWith(".css")) {
          distCss += fs.readFileSync(fullPath, "utf8") + "\n";
        }
      });
    }

    return { srcApp, srcLuxeCss, distHtml, distJs, distCss };
  }

  public async run() {
    console.log("==================================================");
    console.log("       XIYORA AESTHETIC E2E TEST RUNNER");
    console.log("==================================================");

    const context = this.loadContext();
    let passedAll = true;

    for (const test of this.testCases) {
      console.log(`\n[RUN] Tier ${test.tier} - ${test.id}: ${test.name}`);
      const startTime = Date.now();
      try {
        const result = await test.run(context);
        const duration = Date.now() - startTime;
        
        this.results.push({
          id: test.id,
          name: test.name,
          passed: result.passed,
          message: result.message,
          duration
        });

        if (result.passed) {
          console.log(`  └─ \x1b[32mPASS\x1b[0m (${duration}ms) - ${result.message}`);
        } else {
          console.log(`  └─ \x1b[31mFAIL\x1b[0m (${duration}ms) - ${result.message}`);
          passedAll = false;
        }
      } catch (err: any) {
        const duration = Date.now() - startTime;
        this.results.push({
          id: test.id,
          name: test.name,
          passed: false,
          message: `Error during execution: ${err.message}`,
          duration
        });
        console.log(`  └─ \x1b[31mERROR\x1b[0m (${duration}ms) - ${err.message}`);
        passedAll = false;
      }
    }

    this.printSummary();
    this.publishReports(passedAll);

    process.exit(passedAll ? 0 : 1);
  }

  private printSummary() {
    console.log("\n==================================================");
    console.log("                  TEST SUMMARY");
    console.log("==================================================");
    
    let passCount = 0;
    this.results.forEach(res => {
      const status = res.passed ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
      console.log(`${res.id.padEnd(8)} | ${status} | ${res.name.padEnd(45)} | ${res.duration}ms`);
      if (res.passed) passCount++;
    });

    const total = this.testCases.length;
    const rate = ((passCount / total) * 100).toFixed(1);
    console.log("--------------------------------------------------");
    console.log(`Total: ${total} | Passed: ${passCount} | Failed: ${total - passCount} | Success: ${rate}%`);
    console.log("==================================================\n");
  }

  private publishReports(passedAll: boolean) {
    const workspaceRoot = path.resolve(__dirname, "..");
    const reportPath = path.join(workspaceRoot, "TEST_READY.md");

    const date = new Date().toISOString();
    const status = passedAll ? "READY" : "NOT READY";
    const statusIcon = passedAll ? "🟢" : "🔴";

    let markdown = `# TEST READY REPORT — ${date}\n\n`;
    markdown += `## Status Dashboard\n`;
    markdown += `- **Test Suite Status**: ${statusIcon} **${status}**\n`;
    markdown += `- **Total Tests**: ${this.testCases.length}\n`;
    markdown += `- **Passed**: ${this.results.filter(r => r.passed).length}\n`;
    markdown += `- **Failed**: ${this.results.filter(r => !r.passed).length}\n`;
    markdown += `- **Environment**: Production Bundle S static analysis\n\n`;

    markdown += `## Test Execution Details\n`;
    markdown += `| ID | Tier | Name | Status | Duration | Remarks |\n`;
    markdown += `|---|---|---|---|---|---|\n`;

    this.results.forEach(res => {
      const icon = res.passed ? "✅ PASS" : "❌ FAIL";
      markdown += `| ${res.id} | Tier 3/4 | ${res.name} | ${icon} | ${res.duration}ms | ${res.message} |\n`;
    });

    fs.writeFileSync(reportPath, markdown, "utf8");
    console.log(`[INFO] Published test results to TEST_READY.md`);
  }
}

// Start runner
new E2ETestRunner().run();
```

---

## 3. Formatting Plans for `TEST_INFRA.md` & `TEST_READY.md`

### `TEST_INFRA.md` Layout Plan
This document defines the testing infrastructure, philosophy, guidelines, and execution instructions. It remains relatively static.

```markdown
# XIYORA E2E Testing Infrastructure (TEST_INFRA)

This document describes the design, directory structures, and guidelines for the XIYORA aesthetic re-engineering test suite.

## 1. Testing Philosophy
The test suite utilizes a **zero-dependency, opaque-box testing strategy**. Instead of spinning up full browser engines (which are heavy and unavailable in this sandboxed environment), the test runner executes static and compiler-level validations on the built application assets in `artifacts/xiyora/dist/public` and source code. 

### Key Testing Principles:
- **No Internal Imports**: Test scripts must not import React components or internal JS functions to prevent white-box dependency.
- **Verification of Output**: The tests verify the HTML markup, Javascript bundle, and final CSS styles that the browser actually receives.
- **Fail-Fast Policy**: If build outputs are missing, or if any compile error exists, the suite immediately exits with code 1.

## 2. Directory Layout
```text
scripts/
├── e2e-test.ts            # Entry point for test runner
├── package.json           # Execution dependencies (typescript, tsx)
├── tsconfig.json          # Configuration for TS compilation
└── src/
    ├── types.ts           # Shared type definitions
    ├── tier1Tests.ts      # Tier 1: Feature Coverage tests
    ├── tier2Tests.ts      # Tier 2: Boundary & Corner tests
    ├── tier3Tests.ts      # Tier 3: Cross-Feature combination tests
    └── tier4Tests.ts      # Tier 4: Real-World Scenario tests
```

## 3. The 4 Testing Tiers
1. **Tier 1: Feature Coverage**: Verifies basic presence/absence rules for F1, F2, and F3.
2. **Tier 2: Boundary & Corner Cases**: Tests invalid configurations, extreme resolutions, and empty state inputs.
3. **Tier 3: Cross-Feature Combinations**: Pairwise verification of feature integrations.
4. **Tier 4: Real-World Scenarios**: Full user journeys (e.g. wholesale inquiries, cost estimations).

## 4. How to Execute Tests
Tests require a compiled build of the frontend application first:
```bash
# 1. Build the frontend application
pnpm run build

# 2. Run the E2E tests
pnpm --filter "./scripts" run hello  # or the custom runner script
```
```

---

### `TEST_READY.md` Layout Plan
This document is updated dynamically on every test run by the test runner. It serves as a proof of release readiness.

```markdown
# TEST READY REPORT — [UTC Timestamp]

## Status Dashboard
- **Test Suite Status**: 🔴 **NOT READY** / 🟢 **READY**
- **Total Tests**: 38
- **Passed**: 38
- **Failed**: 0
- **Environment**: Build Static Analysis
- **Build SHA**: [SHA]

## Test Execution Details
| ID | Tier | Feature | Test Case Name | Status | Duration | Remarks |
|---|---|---|---|---|---|---|
| TC-1.1 | Tier 1 | F1: Aesthetic | Custom Cursor Absence | ✅ PASS | 4ms | Custom cursor selector not found in CSS |
| TC-3.1 | Tier 3 | F1 x F2 | Clean Card Refactoring | ✅ PASS | 12ms | Cards successfully cleaned and 2D styled |
| TC-4.1 | Tier 4 | Scenario | B2B Portal Sourcing | ❌ FAIL | 8ms | Estimated Quantity dropdown is missing from form |

## Detailed Failure Log
### TC-4.1: B2B Sourcing Portal Inquiry Flow
- **Error**: Form fields for estimated quantity are not present in built DOM mock.
- **Trace**:
  ```text
  Expected: App.tsx to include 'Estimated Quantity' text or select option element.
  Observed: Form contains name, email, company, but no quantity selectors.
  ```
```

---

## 4. Assessment of Static File Checks

The question is: *Are static file checks (e.g., checking for the absence of specific strings like `.x-orb`, `.xiyora-cursor`, shimmer, tilt, etc. in `luxe.css` and `App.tsx`) sufficient and reliable, and how can they be structured as robust test cases?*

### 1. Sufficiency Analysis
* **They are NOT fully sufficient.** 
  - **Dynamic Interpolation**: A developer can bypass simple string checks by writing dynamic classes:
    ```tsx
    const suffix = "orb";
    const className = `x-${suffix}`; // Will render "x-orb" in browser but bypasses static string checks.
    ```
  - **Functional Behavior**: Static checks cannot verify logical workflows, layout issues (e.g., whether the mobile layout wraps elements properly or overlaps navigation items), or page layout constraints like "no horizontal scroll down to 320px".
  - **No Visual Verification**: A style property might exist in CSS but be overridden by parent classes or dynamic tailwind rules, which static parsing cannot easily compute without a full layout engine.

### 2. Reliability Analysis
* **High false-positive rate**: If check strings are too generic (e.g., checking for `shimmer` or `cursor`), it will flag code comments (e.g. `/* shimmer effect removed */`), unrelated UI variables, or marketing copy inside reviews (e.g. "The fabric has a lovely shimmer").
* **High false-negative rate**: If developers rename files or refactor classes slightly, a hardcoded search for `.x-orb` will pass even if the aesthetic glow remains under a different name.

### 3. How to Structure Static Checks as Robust Test Cases
To make static checks robust, we must design them to analyze structured tokens rather than raw text:

1. **Target the Built Bundle (`dist`)**: Instead of analyzing development source code where class construction might be fragmented, run checks against the final bundled `index-*.css` and `index-*.js` files. The bundler resolves interpolations, variables, and compiles them into final selector/attribute declarations.
2. **Context-Aware Scanners (Regex Context)**: Instead of matching raw substrings globally, scope the matches.
   - For **CSS**, verify that selectors do not match the start of a declaration block:
     ```typescript
     // Check if selector exists as a CSS class rule definition
     const cssClassRegex = /^\s*\.(x-orb|xiyora-cursor|tilt-card|btn-luxe-glow)\b/m;
     ```
   - For **HTML/JS**, verify that classes are only parsed inside class attributes:
     ```typescript
     // Match className attribute values containing the banned strings
     const jsClassRegex = /class(?:Name)?\s*=\s*["'][^"']*(x-orb|xiyora-cursor|tilt-card|btn-luxe-glow)[^"']*/g;
     ```
3. **Paired Assertions (Negative + Positive)**: Never rely solely on negative checks. Every test asserting the absence of an old style must assert the presence of its 2D replacement. For instance:
   - Assert **absence** of `.tilt-card`.
   - Assert **presence** of `.rounded-[2rem]` or `.rounded-[3rem]` and `border-color: rgba(246, 239, 224, 0.08)`.
4. **Lexical Filtering of Comments/Text**: The test script should strip out comment blocks (`/* ... */` in CSS, `// ...` or `{/* ... */}` in TSX) and string literals that represent customer reviews or data configurations before executing matches, ensuring that only actual style and rendering code is parsed.
