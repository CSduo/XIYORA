export interface TestResult {
  passed: boolean;
  message?: string;
  details?: string;
}

export interface TestContext {
  appTsx: string;
  luxeCss: string;
  indexHtml: string;
  bundleJs: string;
  bundleCss: string;
  paths: {
    appTsx: string;
    luxeCss: string;
    indexHtml: string;
    bundleJs: string;
    bundleCss: string;
  };
}

export interface TestCase {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  run: (ctx: TestContext) => TestResult | Promise<TestResult>;
}
