import { TestCase, TestContext, TestResult } from "./types";

export const tier2Tests: TestCase[] = [
  {
    id: "T2_RadiusLowerLimit",
    name: "T2-1: Border Radius Lower Bound Check",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Find all custom card/button style declarations in luxe.css or bundleCss.
      // In baseline, .pc-luxe has border-radius: 4px; and .stat-badge has border-radius: 8px;
      const pcLuxeMatch = ctx.luxeCss.match(/\.pc-luxe\s*\{[^}]*border-radius:\s*(\d+)px/);
      const statBadgeMatch = ctx.luxeCss.match(/\.stat-badge\s*\{[^}]*border-radius:\s*(\d+)px/);
      
      if (pcLuxeMatch && parseInt(pcLuxeMatch[1]) < 32) {
        return {
          passed: false,
          message: `Legacy border-radius (${pcLuxeMatch[1]}px) on .pc-luxe violates the minimum 32px (2rem) premium design limit.`,
          details: `Found border-radius: ${pcLuxeMatch[1]}px under .pc-luxe.`
        };
      }
      if (statBadgeMatch && parseInt(statBadgeMatch[1]) < 32) {
        return {
          passed: false,
          message: `Legacy border-radius (${statBadgeMatch[1]}px) on .stat-badge violates the minimum 32px (2rem) premium design limit.`,
          details: `Found border-radius: ${statBadgeMatch[1]}px under .stat-badge.`
        };
      }

      // Check if there are any small tailwind border roundings (rounded-sm, rounded-md, rounded-lg, rounded-xl)
      // used for cards/buttons in App.tsx. Since the premium standard requires 2rem to 3rem,
      // let's look for components using these smaller roundings.
      const hasSmallTailwindOnCards = ctx.appTsx.includes("rounded-md") || ctx.appTsx.includes("rounded-lg") || ctx.appTsx.includes("rounded-xl");
      if (hasSmallTailwindOnCards) {
        // In the premium version, cards and buttons must use rounded-[2rem] to rounded-[3rem].
        // Small Tailwind classes fail this limit.
        return {
          passed: false,
          message: "Found legacy small Tailwind border-radius classes (rounded-md/lg/xl) in App.tsx.",
          details: "Major elements should use rounded-[2rem] to rounded-[3rem]."
        };
      }

      return { passed: true, message: "Border radius is within the premium design bounds." };
    }
  },
  {
    id: "T2_RadiusUpperLimit",
    name: "T2-2: Border Radius Upper Bound Check",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Roundings must not exceed 3rem (48px) for cards/buttons.
      const hasOverRounded = ctx.appTsx.includes("rounded-[4rem]") || ctx.appTsx.includes("rounded-[5rem]") || ctx.luxeCss.includes("border-radius: 64px");
      if (hasOverRounded) {
        return {
          passed: false,
          message: "Border radius exceeds the maximum 48px (3rem) premium limit.",
          details: "Found rounded-[4rem] or equivalent over-rounded style."
        };
      }
      return { passed: true, message: "Border radius does not exceed upper premium design limit." };
    }
  },
  {
    id: "T2_FontFallbackSerif",
    name: "T2-3: Serif Font Family Fallbacks",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Find serif fonts and make sure fallbacks are present.
      // Search for font-family definitions in CSS and TSX.
      const playfairDeclarations = ctx.luxeCss.match(/font-family:\s*['"]Playfair Display['"]\s*([^;]*)/g);
      if (playfairDeclarations) {
        for (const dec of playfairDeclarations) {
          if (!dec.includes("serif") && !dec.includes("Georgia")) {
            return {
              passed: false,
              message: `Font family definition '${dec}' lacks serif fallback.`,
              details: `luxe.css contains: ${dec}`
            };
          }
        }
      }
      return { passed: true, message: "Serif font fallback verified." };
    }
  },
  {
    id: "T2_FontFallbackSans",
    name: "T2-4: Sans-Serif Font Family Fallbacks",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      const interDeclarations = ctx.luxeCss.match(/font-family:\s*['"]Inter['"]\s*([^;]*)/g);
      if (interDeclarations) {
        for (const dec of interDeclarations) {
          if (!dec.includes("sans-serif")) {
            return {
              passed: false,
              message: `Font family definition '${dec}' lacks sans-serif fallback.`,
              details: `luxe.css contains: ${dec}`
            };
          }
        }
      }
      return { passed: true, message: "Sans-serif font fallback verified." };
    }
  },
  {
    id: "T2_MinWidthLimit",
    name: "T2-5: Responsive Minimum Width Protection",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Ensure there are no absolute min-width properties that break viewports <= 320px.
      const hasLargeMinWidth = ctx.luxeCss.match(/min-width:\s*([4-9]\d{2}|[1-9]\d{3})px/);
      if (hasLargeMinWidth) {
        return {
          passed: false,
          message: `Found hardcoded layout min-width of ${hasLargeMinWidth[1]}px which breaks responsive layouts.`,
          details: `Matched in CSS: ${hasLargeMinWidth[0]}`
        };
      }
      return { passed: true, message: "Minimum width bounds check passed." };
    }
  },
  {
    id: "T2_MenuCollapseState",
    name: "T2-6: Mobile Drawer Navigation Collapse Logic",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Check for presence of state variable hook to toggle the menu open/closed state.
      const hasMenuState = ctx.appTsx.includes("isOpen") || ctx.appTsx.includes("showDrawer") || ctx.appTsx.includes("mobileMenu") || ctx.appTsx.includes("isMenuOpen");
      if (!hasMenuState) {
        return {
          passed: false,
          message: "No menu drawer boolean state toggle logic found in App.tsx.",
          details: "App.tsx lacks active menu toggling state."
        };
      }
      return { passed: true, message: "Menu collapse state logic verified." };
    }
  },
  {
    id: "T2_BorderOpacityLimit",
    name: "T2-7: Border Opacity Limits",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Fine borders must be 1px solid rgba(246, 239, 224, 0.08)
      // Check that baseline custom borders with higher opacity (e.g. 0.22 or 0.35) are removed.
      const hasHighOpacityBorders = ctx.luxeCss.includes("rgba(200,169,126,0.35)") || ctx.luxeCss.includes("rgba(200,169,126,0.22)");
      if (hasHighOpacityBorders) {
        return {
          passed: false,
          message: "Visual system utilizes high opacity borders (0.22 - 0.35) which clash with the premium design.",
          details: "Legacy high opacity borders found in CSS."
        };
      }
      return { passed: true, message: "Border opacity is correct." };
    }
  },
  {
    id: "T2_PaddingBounds",
    name: "T2-8: Layout Grid Padding Boundaries",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Check that section paddings are responsive and not zero on larger screens.
      const hasZeroPaddingOnSection = ctx.appTsx.includes("section className=\"p-0\"");
      if (hasZeroPaddingOnSection) {
        return {
          passed: false,
          message: "Sections are lacking breathing room, violating premium layout specifications.",
          details: "Found section with zero padding."
        };
      }
      return { passed: true, message: "Grid padding boundaries check passed." };
    }
  },
  {
    id: "T2_ShadowBounds",
    name: "T2-9: Box Shadow Intensity Limits",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Check for neon/glow shadows.
      // In baseline: box-shadow: 0 0 30px rgba(200,169,126,0.22), box-shadow: 0 0 32px rgba(200,169,126,0.38)
      const hasGlowShadows = ctx.luxeCss.includes("box-shadow: 0 0 30px") || ctx.luxeCss.includes("box-shadow: 0 0 32px") || ctx.luxeCss.includes("box-shadow: 0 0 14px");
      if (hasGlowShadows) {
        return {
          passed: false,
          message: "Legacy high intensity/glow drop shadows found in visual assets.",
          details: "Found high-blur or high-opacity box-shadows."
        };
      }
      return { passed: true, message: "Box shadows are within design limits." };
    }
  },
  {
    id: "T2_ZIndexBounds",
    name: "T2-10: Layer Z-Index Boundaries Check",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Cursor has z-index: 99999 and 100000. These must be removed.
      const hasCursorZIndex = ctx.luxeCss.includes("z-index: 99999") || ctx.luxeCss.includes("z-index: 100000");
      if (hasCursorZIndex) {
        return {
          passed: false,
          message: "Legacy custom cursor z-indexes (99999/100000) are still defined.",
          details: "Found high z-index values meant for cursor layers."
        };
      }
      return { passed: true, message: "Z-index bounds check passed." };
    }
  },
  {
    id: "T2_OpacityBounds",
    name: "T2-11: Typography Opacity Readability Check",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Fails if body text uses extremely faint styling.
      const hasFaintText = ctx.appTsx.includes("text-white/10") || ctx.appTsx.includes("text-white/20");
      if (hasFaintText) {
        return {
          passed: false,
          message: "Found low-opacity text colors (10%-20%) which violate premium readability contracts.",
          details: "Detected text-white/10 or text-white/20 classes in App.tsx."
        };
      }
      return { passed: true, message: "Typography opacity is within readable bounds." };
    }
  },
  {
    id: "T2_TransitionDuration",
    name: "T2-12: Transition Timing Limits",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Verify transition timings are within acceptable limits.
      // In baseline: transition: width 22s / orbDrift 22s / marqueeRight 34s
      const hasExcessiveTransition = ctx.luxeCss.includes("22s") || ctx.luxeCss.includes("34s");
      if (hasExcessiveTransition) {
        return {
          passed: false,
          message: "Found excessively long/slow transitions/animations (> 10s) associated with legacy visual effects.",
          details: "Matched slow animation/transition definitions in CSS."
        };
      }
      return { passed: true, message: "Transition duration limits verified." };
    }
  },
  {
    id: "T2_ImageObjectFit",
    name: "T2-13: Image Scale Object-Fit Verification",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // In product cards, images must have object-fit classes to prevent stretching.
      const hasObjectFitClass = ctx.appTsx.includes("object-cover") || ctx.appTsx.includes("object-contain");
      if (!hasObjectFitClass) {
        return {
          passed: false,
          message: "No object-fit classes (object-cover/object-contain) detected for visual assets.",
          details: "Ensure images have object-fit layout protection."
        };
      }
      return { passed: true, message: "Image object-fit scaling verified." };
    }
  },
  {
    id: "T2_ButtonFocusState",
    name: "T2-14: Interactive Element Focus State Accessibility",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Check for focus outline indicators or styling in CSS or TSX.
      const hasFocusState = ctx.appTsx.includes("focus:") || ctx.luxeCss.includes(":focus") || ctx.appTsx.includes("focus-visible");
      if (!hasFocusState) {
        return {
          passed: false,
          message: "Interactive buttons or links do not define focus/active accessibility outlines.",
          details: "No focus pseudo-selectors or utility classes detected."
        };
      }
      return { passed: true, message: "Interactive focus states verified." };
    }
  },
  {
    id: "T2_FlexWrapLimit",
    name: "T2-15: Flex Layout Wrap Settings",
    tier: 2,
    run: (ctx: TestContext): TestResult => {
      // Flex row layout must have flex-wrap or responsive styling so they don't cause overflow on mobile.
      const hasNoWrapFlex = ctx.appTsx.includes("flex flex-row") && !ctx.appTsx.includes("flex-wrap");
      if (hasNoWrapFlex) {
        return {
          passed: false,
          message: "Flex row layout detected without flex-wrap configuration, risking viewport clipping.",
          details: "Check layout flex containers for wrap safety."
        };
      }
      return { passed: true, message: "Flex layouts are configured safely." };
    }
  }
];
