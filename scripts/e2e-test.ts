import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { tier1Tests } from "./src/tier1";
import { tier2Tests } from "./src/tier2";
import { tier3Tests } from "./src/tier3";
import { tier4Tests } from "./src/tier4";
import { TestContext, TestResult, TestCase } from "./src/types";

// Resolve __dirname since we are using ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find workspace root (going up to XIYORA)
const findWorkspaceRoot = (): string => {
  let current = __dirname;
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, "pnpm-workspace.yaml")) || fs.existsSync(path.join(current, "artifacts"))) {
      return current;
    }
    current = path.dirname(current);
  }
  return "C:\\Users\\ADMIN\\.gemini\antigravity\\scratch\\XIYORA";
};

async function main() {
  const workspaceRoot = findWorkspaceRoot();
  console.log(`[E2E Test Runner] Workspace root identified as: ${workspaceRoot}`);

  const distDir = path.join(workspaceRoot, "artifacts", "xiyora", "dist", "public");
  const srcAppPath = path.join(workspaceRoot, "artifacts", "xiyora", "src", "App.tsx");
  const srcCssPath = path.join(workspaceRoot, "artifacts", "xiyora", "src", "styles", "luxe.css");
  const distIndexHtml = path.join(distDir, "index.html");

  if (!fs.existsSync(distDir)) {
    console.error(`[E2E Test Runner] Error: Built assets directory not found at: ${distDir}`);
    console.error("Please run the build command first (e.g. 'pnpm run build' inside artifacts/xiyora).");
    process.exit(1);
  }

  // Find dynamically linked assets
  const assetsDir = path.join(distDir, "assets");
  let bundleJsPath = "";
  let bundleCssPath = "";

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const jsFile = files.find(f => f.startsWith("index-") && f.endsWith(".js"));
    const cssFile = files.find(f => f.startsWith("index-") && f.endsWith(".css"));
    
    if (jsFile) {
      bundleJsPath = path.join(assetsDir, jsFile);
      console.log(`[E2E Test Runner] Found JS Bundle: ${jsFile}`);
    }
    if (cssFile) {
      bundleCssPath = path.join(assetsDir, cssFile);
      console.log(`[E2E Test Runner] Found CSS Bundle: ${cssFile}`);
    }
  }

  // Load contents into context
  const appTsx = fs.existsSync(srcAppPath) ? fs.readFileSync(srcAppPath, "utf-8") : "";
  const luxeCss = fs.existsSync(srcCssPath) ? fs.readFileSync(srcCssPath, "utf-8") : "";
  const indexHtml = fs.existsSync(distIndexHtml) ? fs.readFileSync(distIndexHtml, "utf-8") : "";
  const bundleJs = bundleJsPath && fs.existsSync(bundleJsPath) ? fs.readFileSync(bundleJsPath, "utf-8") : "";
  const bundleCss = bundleCssPath && fs.existsSync(bundleCssPath) ? fs.readFileSync(bundleCssPath, "utf-8") : "";


  const ctx: TestContext = {
    appTsx,
    luxeCss,
    indexHtml,
    bundleJs,
    bundleCss,
    paths: {
      appTsx: srcAppPath,
      luxeCss: srcCssPath,
      indexHtml: distIndexHtml,
      bundleJs: bundleJsPath,
      bundleCss: bundleCssPath
    }
  };

  const allTests: TestCase[] = [
    ...tier1Tests,
    ...tier2Tests,
    ...tier3Tests,
    ...tier4Tests
  ];

  console.log(`[E2E Test Runner] Loaded ${allTests.length} test cases sequentially.`);
  console.log("------------------------------------------------------------");

  const results: { test: TestCase; result: TestResult }[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const test of allTests) {
    try {
      const res = await test.run(ctx);
      results.push({ test, result: res });
      if (res.passed) {
        passedCount++;
        console.log(`[PASS] [Tier ${test.tier}] ${test.id} - ${test.name}`);
      } else {
        failedCount++;
        console.warn(`[FAIL] [Tier ${test.tier}] ${test.id} - ${test.name}`);
        if (res.message) console.warn(`       Reason: ${res.message}`);
        if (res.details) console.warn(`       Details: ${res.details}`);
      }
    } catch (err) {
      failedCount++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      results.push({ test, result: { passed: false, message: "Execution error", details: errorMessage } });
      console.error(`[ERR]  [Tier ${test.tier}] ${test.id} - ${test.name}`);
      console.error(`       Error: ${errorMessage}`);
    }
  }

  console.log("------------------------------------------------------------");
  console.log(`[E2E Test Runner] Summary: ${passedCount} passed, ${failedCount} failed, total ${allTests.length}`);

  // Dynamically publish TEST_READY.md at project root
  const testReadyPath = path.join(workspaceRoot, "TEST_READY.md");
  const timestamp = new Date().toISOString();
  
  let mdContent = `# XIYORA E2E Test Execution Summary

**Timestamp:** ${timestamp}
**Total Tests:** ${allTests.length}
**Passed:** ${passedCount}
**Failed:** ${failedCount}
**Status:** ${failedCount === 0 ? "SUCCESS" : "FAILURE"}

## Detailed Results

| Tier | Test ID | Test Name | Status | Message / Details |
|------|---------|-----------|--------|-------------------|
`;

  for (const { test, result } of results) {
    const statusStr = result.passed ? "✅ PASS" : "❌ FAIL";
    const detailsStr = result.passed ? "-" : `${result.message || ""}${result.details ? ` (${result.details})` : ""}`;
    mdContent += `| Tier ${test.tier} | \`${test.id}\` | ${test.name} | ${statusStr} | ${detailsStr} |\n`;
  }

  fs.writeFileSync(testReadyPath, mdContent, "utf-8");
  console.log(`[E2E Test Runner] Published TEST_READY.md at: ${testReadyPath}`);

  if (failedCount > 0) {
    console.error(`[E2E Test Runner] Run failed with ${failedCount} failures.`);
    process.exit(1);
  } else {
    console.log("[E2E Test Runner] Run completed successfully. All tests passed.");
    process.exit(0);
  }
}

main().catch(err => {
  console.error("[E2E Test Runner] Unhandled error during test run:", err);
  process.exit(1);
});
