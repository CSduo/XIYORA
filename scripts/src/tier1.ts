import { TestCase, TestContext, TestResult } from "./types";

export const tier1Tests: TestCase[] = [
  {
    id: "T1_F1_CursorClasses",
    name: "F1-1: Custom Cursor CSS Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasCursor = ctx.luxeCss.includes(".xiyora-cursor") || ctx.bundleCss.includes(".xiyora-cursor");
      if (hasCursor) {
        return {
          passed: false,
          message: "Legacy custom cursor classes (.xiyora-cursor or .xiyora-cursor-dot) found in CSS assets.",
          details: "Found cursor classes in luxe.css or CSS bundle."
        };
      }
      return { passed: true, message: "Custom cursor classes successfully removed." };
    }
  },
  {
    id: "T1_F1_CursorJS",
    name: "F1-2: Custom Cursor JS Logic Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasCursorJS = ctx.appTsx.includes("xiyora-cursor") || ctx.bundleJs.includes("xiyora-cursor") || ctx.appTsx.includes("cursorX") || ctx.appTsx.includes("cursorY");
      if (hasCursorJS) {
        return {
          passed: false,
          message: "Legacy custom cursor event listeners or state handlers found in JS/TSX assets.",
          details: "Found custom cursor state/element references in App.tsx or JS bundle."
        };
      }
      return { passed: true, message: "Custom cursor JS logic successfully removed." };
    }
  },
  {
    id: "T1_F1_OrbClasses",
    name: "F1-3: Ambient Gradient Orbs CSS Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasOrbClass = ctx.luxeCss.includes(".x-orb") || ctx.bundleCss.includes(".x-orb") || ctx.luxeCss.includes("orbDrift");
      if (hasOrbClass) {
        return {
          passed: false,
          message: "Ambient gradient orb styles or keyframes (orbDrift) found in CSS assets.",
          details: "Found .x-orb class or orbDrift keyframe in luxe.css or CSS bundle."
        };
      }
      return { passed: true, message: "Ambient gradient orb styles successfully removed." };
    }
  },
  {
    id: "T1_F1_OrbElements",
    name: "F1-4: Ambient Gradient Orbs TSX Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasOrbElement = ctx.appTsx.includes("x-orb") || ctx.bundleJs.includes("x-orb");
      if (hasOrbElement) {
        return {
          passed: false,
          message: "Legacy gradient orb components or elements found in JS/TSX assets.",
          details: "Found x-orb tags or elements in App.tsx or JS bundle."
        };
      }
      return { passed: true, message: "Gradient orb elements successfully removed." };
    }
  },
  {
    id: "T1_F1_TiltCardClass",
    name: "F1-5: 3D Tilt Card CSS Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasTiltClass = ctx.luxeCss.includes(".tilt-card") || ctx.bundleCss.includes(".tilt-card");
      if (hasTiltClass) {
        return {
          passed: false,
          message: "Legacy 3D tilt-card styles found in CSS assets.",
          details: "Found .tilt-card class in luxe.css or CSS bundle."
        };
      }
      return { passed: true, message: "3D tilt-card styles successfully removed." };
    }
  },
  {
    id: "T1_F1_TiltJS",
    name: "F1-6: 3D Tilt JS Logic Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasTiltJS = ctx.appTsx.includes("vanilla-tilt") || ctx.appTsx.includes("VanillaTilt") || ctx.bundleJs.includes("vanilla-tilt") || ctx.appTsx.includes("tilt-card");
      if (hasTiltJS) {
        return {
          passed: false,
          message: "Legacy 3D tilt JS handlers or libraries found in JS/TSX assets.",
          details: "Found vanilla-tilt or tilt-card references in App.tsx or JS bundle."
        };
      }
      return { passed: true, message: "3D tilt JS logic successfully removed." };
    }
  },
  {
    id: "T1_F1_CanvasRemoval",
    name: "F1-7: Hero Particle Canvas Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasCanvas = ctx.luxeCss.includes("hero-particle-canvas") || ctx.appTsx.includes("hero-particle-canvas") || ctx.appTsx.includes("ParticleCanvas") || ctx.bundleJs.includes("hero-particle-canvas") || ctx.bundleCss.includes("hero-particle-canvas");
      if (hasCanvas) {
        return {
          passed: false,
          message: "Legacy particle canvas element or styles found in assets.",
          details: "Found hero-particle-canvas or canvas rendering logic."
        };
      }
      return { passed: true, message: "Hero particle canvas successfully removed." };
    }
  },
  {
    id: "T1_F1_NeonGlowCSS",
    name: "F1-8: Neon Sweeps & Glow Styles Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasGlow = ctx.luxeCss.includes("goldBorderPulse") || ctx.luxeCss.includes("box-shadow: 0 0 30px") || ctx.bundleCss.includes("goldBorderPulse") || ctx.luxeCss.includes("rgba(200,169,126,0.38)");
      if (hasGlow) {
        return {
          passed: false,
          message: "Legacy neon or glow shadows/keyframes found in CSS assets.",
          details: "Found goldBorderPulse or high-glow shadow styles in CSS."
        };
      }
      return { passed: true, message: "Neon glows and sweep styles successfully removed." };
    }
  },
  {
    id: "T1_F1_FloatingBadges",
    name: "F1-9: Floating/Drifting Animation Removal Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      const hasFloat = ctx.luxeCss.includes(".stat-badge:hover") && ctx.luxeCss.includes("translateY(-5px)");
      if (hasFloat) {
        return {
          passed: false,
          message: "Legacy float/drift animation offsets (translateY on hover) found in CSS assets.",
          details: "Found hover transform translation offset on stat-badge in CSS."
        };
      }
      return { passed: true, message: "Float/drift animations successfully removed." };
    }
  },
  {
    id: "T1_F2_FineBorders",
    name: "F2-1: 2D Premium Fine Borders Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Must contain clean 2D line borders utilizing rgba(246, 239, 224, 0.08)
      const hasPremiumBorder = ctx.luxeCss.includes("rgba(246, 239, 224, 0.08)") || ctx.appTsx.includes("rgba(246, 239, 224, 0.08)") || ctx.bundleCss.includes("246, 239, 224, 0.08");
      if (!hasPremiumBorder) {
        return {
          passed: false,
          message: "Missing premium 2D fine borders utilizing rgba(246, 239, 224, 0.08) in CSS/TSX.",
          details: "No reference to rgba(246, 239, 224, 0.08) found."
        };
      }
      return { passed: true, message: "2D premium fine borders are successfully implemented." };
    }
  },
  {
    id: "T1_F2_SectionDividers",
    name: "F2-2: Section Dividers Aesthetic Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Divider must not use gradient sweeps
      const hasGradientSweep = ctx.luxeCss.includes("x-gold-divider") && ctx.luxeCss.includes("linear-gradient");
      if (hasGradientSweep) {
        return {
          passed: false,
          message: "Section dividers still utilize gradient sweeps or glowing lines in CSS.",
          details: "Found linear-gradient on x-gold-divider in CSS."
        };
      }
      return { passed: true, message: "Section dividers are clean 2D lines without gradient sweeps." };
    }
  },
  {
    id: "T1_F2_CardButtonRounding",
    name: "F2-3: Card and Button Border Rounding Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Card and button elements must use rounding between 2rem (32px) and 3rem (48px)
      // We should check that small rounding values are not used on main cards/buttons
      // In baseline, .pc-luxe uses border-radius: 4px; and .stat-badge uses border-radius: 8px;
      const hasSmallRounding = ctx.luxeCss.includes("border-radius: 4px") || ctx.luxeCss.includes("border-radius: 8px");
      if (hasSmallRounding) {
        return {
          passed: false,
          message: "Main card or button elements use small rounding (e.g. 4px, 8px) which violates the 2rem-3rem organic rounding requirement.",
          details: "Found small border-radius in CSS."
        };
      }
      return { passed: true, message: "Card and button elements follow organic rounding range." };
    }
  },
  {
    id: "T1_F2_TypographySerif",
    name: "F2-4: Typography Serif Font Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Headers use serif font (Playfair Display)
      const hasPlayfair = ctx.indexHtml.includes("Playfair+Display") || ctx.appTsx.includes("Playfair Display") || ctx.luxeCss.includes("Playfair Display");
      if (!hasPlayfair) {
        return {
          passed: false,
          message: "Serif font 'Playfair Display' link or style references are missing.",
          details: "Could not find references to Playfair Display."
        };
      }
      return { passed: true, message: "Serif typography for headers is verified." };
    }
  },
  {
    id: "T1_F2_TypographySans",
    name: "F2-5: Typography Sans-Serif Font Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Body text and descriptions use sans-serif font (Inter)
      const hasInter = ctx.indexHtml.includes("Inter") || ctx.appTsx.includes("Inter") || ctx.luxeCss.includes("Inter");
      if (!hasInter) {
        return {
          passed: false,
          message: "Sans-serif font 'Inter' link or style references are missing.",
          details: "Could not find references to Inter."
        };
      }
      return { passed: true, message: "Sans-serif typography for body text is verified." };
    }
  },
  {
    id: "T1_F3_NoHorizontalScroll",
    name: "F3-1: No Horizontal Scroll Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Checks for layout containers preventing overflow
      const hasOverflowHidden = ctx.appTsx.includes("overflow-x-hidden") || ctx.luxeCss.includes("overflow-x: hidden");
      if (!hasOverflowHidden) {
        return {
          passed: false,
          message: "Missing overflow-x-hidden declarations to safeguard against horizontal scroll.",
          details: "No overflow-x-hidden detected in layout classes."
        };
      }
      return { passed: true, message: "Horizontal overflow prevention verified." };
    }
  },
  {
    id: "T1_F3_MobileDrawer",
    name: "F3-2: Mobile Navigation Drawer Verification",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Check for mobile drawer trigger state/logic in App.tsx
      const hasMobileDrawer = ctx.appTsx.includes("drawer") || ctx.appTsx.includes("sidebar") || ctx.appTsx.includes("sdrawer") || ctx.indexHtml.includes("sdrawer");
      if (!hasMobileDrawer) {
        return {
          passed: false,
          message: "Mobile side drawer navigation element is missing from TSX.",
          details: "Could not find mobile drawer references in App.tsx."
        };
      }
      return { passed: true, message: "Mobile navigation drawer verified." };
    }
  },
  {
    id: "T1_F3_HeaderNavigation",
    name: "F3-3: Collapsible Header Navigation Menu",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Ensure navigation hides on smaller screens, using standard tailwind responsive prefixes
      const hasResponsiveNav = ctx.appTsx.includes("hidden md:flex") || ctx.appTsx.includes("hidden lg:flex") || ctx.appTsx.includes("md:flex hidden") || ctx.appTsx.includes("lg:flex hidden");
      if (!hasResponsiveNav) {
        return {
          passed: false,
          message: "Header navigation items do not collapse or hide on smaller viewports.",
          details: "Could not find responsive hidden classes on desktop nav items."
        };
      }
      return { passed: true, message: "Collapsible header navigation verified." };
    }
  },
  {
    id: "T1_F3_MediaQueries",
    name: "F3-4: CSS Media Queries Stacking Check",
    tier: 1,
    run: (ctx: TestContext): TestResult => {
      // Check for stacked layouts inside @media query
      const hasMediaQueries = ctx.indexHtml.includes("@media(max-width:900px)") || ctx.luxeCss.includes("@media") || ctx.bundleCss.includes("@media");
      if (!hasMediaQueries) {
        return {
          passed: false,
          message: "CSS media queries for mobile-stacked layouts are missing.",
          details: "Could not find media query rules."
        };
      }
      return { passed: true, message: "Responsive media queries verified." };
    }
  }
];
