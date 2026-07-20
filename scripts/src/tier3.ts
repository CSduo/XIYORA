import { TestCase, TestContext, TestResult } from "./types";

export const tier3Tests: TestCase[] = [
  {
    id: "T3_F1_F2_Combined",
    name: "T3-1: Product Card Premium Refactoring (F1 + F2)",
    tier: 3,
    run: (ctx: TestContext): TestResult => {
      // Product cards (.pc-luxe) must remove legacy glowing hover animations (F1)
      // and adopt premium organic border roundings (F2).
      const hasGlow = ctx.luxeCss.includes("pc-luxe:hover") && ctx.luxeCss.includes("rgba(200,169,126,0.22)");
      const hasSmallRounding = ctx.luxeCss.includes(".pc-luxe") && ctx.luxeCss.includes("border-radius: 4px");

      if (hasGlow && hasSmallRounding) {
        return {
          passed: false,
          message: "Product cards (.pc-luxe) still utilize legacy hover glows (F1) and small border roundings (F2).",
          details: "Product cards violate both F1 (glows) and F2 (rounding)."
        };
      }
      if (hasGlow) {
        return {
          passed: false,
          message: "Product cards (.pc-luxe) still utilize legacy hover glows (F1).",
          details: "Found glow shadows under .pc-luxe:hover."
        };
      }
      if (hasSmallRounding) {
        return {
          passed: false,
          message: "Product cards (.pc-luxe) still utilize legacy small border roundings (F2).",
          details: "Found border-radius: 4px on .pc-luxe."
        };
      }

      return { passed: true, message: "Product cards successfully combine F1 removal and F2 premium styling." };
    }
  },
  {
    id: "T3_F2_F3_Combined",
    name: "T3-2: Responsive Section Borders and Grids (F2 + F3)",
    tier: 3,
    run: (ctx: TestContext): TestResult => {
      // Verify that the B2B or hero sections combine 2D fine borders (F2) and responsive column stacking (F3).
      // Checks for B2B grid section stacked columns in media queries and presence of fine borders.
      const hasFineBorder = ctx.luxeCss.includes("rgba(246, 239, 224, 0.08)") || ctx.appTsx.includes("rgba(246, 239, 224, 0.08)");
      const hasStackedGrid = ctx.luxeCss.includes(".biz-grid") && ctx.luxeCss.includes("grid-template-columns:1fr!important");

      if (!hasFineBorder) {
        return {
          passed: false,
          message: "Missing fine borders (F2) in layout sections.",
          details: "rgba(246, 239, 224, 0.08) not declared."
        };
      }
      if (!hasStackedGrid) {
        return {
          passed: false,
          message: "Missing responsive grid column stacking override (F3) for B2B portal layouts.",
          details: "Could not find .biz-grid column stacked media rules."
        };
      }

      return { passed: true, message: "Responsive sections successfully combine F2 premium borders and F3 column layouts." };
    }
  },
  {
    id: "T3_F1_F3_Combined",
    name: "T3-3: Clean Mobile Drawer Navigation (F1 + F3)",
    tier: 3,
    run: (ctx: TestContext): TestResult => {
      // Mobile drawer (F3) must be completely free of legacy custom cursors, neon colors, and float animations (F1).
      const hasDrawerCursor = ctx.luxeCss.includes(".sdrawer") && ctx.luxeCss.includes("xiyora-cursor");
      const hasDrawerGlow = ctx.luxeCss.includes(".sdrawer") && (ctx.luxeCss.includes("glow") || ctx.luxeCss.includes("radial-gradient"));

      if (hasDrawerCursor) {
        return {
          passed: false,
          message: "Mobile drawer element references custom trailing cursor (F1).",
          details: "Legacy cursor styling bound to mobile drawer."
        };
      }
      if (hasDrawerGlow) {
        return {
          passed: false,
          message: "Mobile drawer element uses glow gradients or neon indicators (F1).",
          details: "Legacy glowing background/gradients on mobile drawer."
        };
      }

      return { passed: true, message: "Mobile drawer is clean of legacy aesthetics." };
    }
  }
];
