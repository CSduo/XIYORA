# XIYORA E2E Test Suite Infrastructure

This is the automated E2E Test Suite for the XIYORA website aesthetic re-engineering project. The test suite is implemented using a zero-dependency, static/programmatic analysis architecture designed to verify key aesthetic guidelines, layout rules, and responsive boundaries on both source files and compiled client assets.

## Architecture

The test suite runs programmatically inside the `scripts` workspace packages:
- It locates the built assets under `artifacts/xiyora/dist/public` and reads the dynamically linked JS and CSS bundle files.
- It loads the source files: `App.tsx` and `luxe.css`.
- It executes 43 test cases sequentially, injecting the loaded asset code contents as a `TestContext`.
- It logs execution details to stdout and publishes a summary in `TEST_READY.md` at the project root.
- It returns exit code `0` if all tests pass, and exit code `1` if any test fails.

## Test Tiers

The test suite consists of 43 test cases divided into 4 tiers:

### Tier 1: Feature Coverage (18 Test Cases)
Verifies feature removal and new visual configurations for:
- **F1 (AI-template aesthetic removal):** Custom cursors, ambient gradient orbs, 3D card tilt, particle canvas, neon sweeps/glow shadows, and hover floats.
- **F2 (2D Premium styling):** 2D fine borders (`rgba(246, 239, 224, 0.08)`), clean section dividers, organic roundings, Playfair Display serif headers, and Inter sans-serif body text.
- **F3 (Responsiveness):** Overflow scroll prevention, mobile navigation side drawer, collapsible desktop navigation, and stacked CSS media query rules.

### Tier 2: Boundary & Corner (15 Test Cases)
Tests edge case properties and limits:
- Card/Button border-radius lower limits (32px / 2rem) and upper limits (48px / 3rem).
- Font fallbacks (proper fallbacks like `sans-serif` and `serif`).
- Layout minimum width limits (preventing desktop layout constraints below 320px).
- Navigation drawer toggling state logic.
- Border opacity checks (verifying the removal of legacy high-opacity dividers).
- Shadow blur/intensity limits and Z-index layer boundaries.
- Text contrast/readability opacities and slow transition durations.
- Image scale `object-fit` protection, keyboard focus outlines, and responsive flex wrap settings.

### Tier 3: Cross-Feature Combination (3 Test Cases)
Verifies feature interactions:
- **F1 + F2:** Product cards (.pc-luxe) combining glow removal and organic border rounding.
- **F2 + F3:** Responsive grids/columns combining fine borders and mobile grid stacking.
- **F1 + F3:** Clean mobile side drawer navigation free of custom cursors or glowing gradients.

### Tier 4: Real-World Scenarios (7 Test Cases)
Validates end-to-end user journeys:
- **B2C Product Discovery:** Styling compliance of product grids, search/filters, and cards.
- **B2B Wholesale Portal:** Landed cost calculator, pricing tables, and MOQ inquiries.
- **Mobile Layout & Drawer:** Drawer visibility, layout stacking, and responsive header.
- **Dark Mode Theme Safety:** Confirming dark mode overrides do not introduce glowing shadows.
- **Checkout Success Screen:** Submission confirmation modal clean serif aesthetics.
- **About Page Sourcing Story:** Sourcing pillars and certification badges visual checks.
- **Admin Dashboard Panel:** Clean UI controls free of custom cursors.

## File Layout

The test suite is structured as follows inside the `scripts/` workspace folder:
```
scripts/
├── tsconfig.json          # TypeScript project configuration (includes e2e-test.ts and src/)
├── package.json           # Dev dependencies (node types and tsx package runner)
├── e2e-test.ts            # Main entry point test runner script
└── src/
    ├── types.ts           # TestCase, TestResult, and TestContext types
    ├── tier1.ts           # Tier 1 Feature Coverage tests (18 cases)
    ├── tier2.ts           # Tier 2 Boundary & Corner tests (15 cases)
    ├── tier3.ts           # Tier 3 Cross-Feature Combination tests (3 cases)
    └── tier4.ts           # Tier 4 Real-World Scenario tests (7 cases)
```

## How to Execute the Tests

### Prerequisites
1. Install project dependencies from the workspace root:
   ```bash
   pnpm install
   ```
2. Build the `xiyora` client application (which populates the built assets folder):
   ```bash
   pnpm --filter @workspace/xiyora run build
   ```

### Running the E2E Test Suite
To run the tests, execute `tsx` on `e2e-test.ts` from the `scripts/` workspace directory:
```bash
cd scripts
pnpm exec tsx e2e-test.ts
```

Alternatively, from the workspace root, you can run:
```bash
pnpm --filter @workspace/scripts exec tsx e2e-test.ts
```

The runner will output a summary to the console and write the results to `TEST_READY.md` at the project root.
