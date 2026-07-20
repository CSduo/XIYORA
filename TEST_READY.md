# XIYORA E2E Test Execution Summary

**Timestamp:** 2026-07-17T02:02:49.516Z
**Total Tests:** 43
**Passed:** 24
**Failed:** 19
**Status:** FAILURE

## Detailed Results

| Tier | Test ID | Test Name | Status | Message / Details |
|------|---------|-----------|--------|-------------------|
| Tier 1 | `T1_F1_CursorClasses` | F1-1: Custom Cursor CSS Removal Check | ❌ FAIL | Legacy custom cursor classes (.xiyora-cursor or .xiyora-cursor-dot) found in CSS assets. (Found cursor classes in luxe.css or CSS bundle.) |
| Tier 1 | `T1_F1_CursorJS` | F1-2: Custom Cursor JS Logic Removal Check | ❌ FAIL | Legacy custom cursor event listeners or state handlers found in JS/TSX assets. (Found custom cursor state/element references in App.tsx or JS bundle.) |
| Tier 1 | `T1_F1_OrbClasses` | F1-3: Ambient Gradient Orbs CSS Removal Check | ❌ FAIL | Ambient gradient orb styles or keyframes (orbDrift) found in CSS assets. (Found .x-orb class or orbDrift keyframe in luxe.css or CSS bundle.) |
| Tier 1 | `T1_F1_OrbElements` | F1-4: Ambient Gradient Orbs TSX Removal Check | ❌ FAIL | Legacy gradient orb components or elements found in JS/TSX assets. (Found x-orb tags or elements in App.tsx or JS bundle.) |
| Tier 1 | `T1_F1_TiltCardClass` | F1-5: 3D Tilt Card CSS Removal Check | ✅ PASS | - |
| Tier 1 | `T1_F1_TiltJS` | F1-6: 3D Tilt JS Logic Removal Check | ✅ PASS | - |
| Tier 1 | `T1_F1_CanvasRemoval` | F1-7: Hero Particle Canvas Removal Check | ❌ FAIL | Legacy particle canvas element or styles found in assets. (Found hero-particle-canvas or canvas rendering logic.) |
| Tier 1 | `T1_F1_NeonGlowCSS` | F1-8: Neon Sweeps & Glow Styles Removal Check | ❌ FAIL | Legacy neon or glow shadows/keyframes found in CSS assets. (Found goldBorderPulse or high-glow shadow styles in CSS.) |
| Tier 1 | `T1_F1_FloatingBadges` | F1-9: Floating/Drifting Animation Removal Check | ❌ FAIL | Legacy float/drift animation offsets (translateY on hover) found in CSS assets. (Found hover transform translation offset on stat-badge in CSS.) |
| Tier 1 | `T1_F2_FineBorders` | F2-1: 2D Premium Fine Borders Verification | ✅ PASS | - |
| Tier 1 | `T1_F2_SectionDividers` | F2-2: Section Dividers Aesthetic Verification | ❌ FAIL | Section dividers still utilize gradient sweeps or glowing lines in CSS. (Found linear-gradient on x-gold-divider in CSS.) |
| Tier 1 | `T1_F2_CardButtonRounding` | F2-3: Card and Button Border Rounding Verification | ✅ PASS | - |
| Tier 1 | `T1_F2_TypographySerif` | F2-4: Typography Serif Font Verification | ✅ PASS | - |
| Tier 1 | `T1_F2_TypographySans` | F2-5: Typography Sans-Serif Font Verification | ✅ PASS | - |
| Tier 1 | `T1_F3_NoHorizontalScroll` | F3-1: No Horizontal Scroll Verification | ❌ FAIL | Missing overflow-x-hidden declarations to safeguard against horizontal scroll. (No overflow-x-hidden detected in layout classes.) |
| Tier 1 | `T1_F3_MobileDrawer` | F3-2: Mobile Navigation Drawer Verification | ✅ PASS | - |
| Tier 1 | `T1_F3_HeaderNavigation` | F3-3: Collapsible Header Navigation Menu | ❌ FAIL | Header navigation items do not collapse or hide on smaller viewports. (Could not find responsive hidden classes on desktop nav items.) |
| Tier 1 | `T1_F3_MediaQueries` | F3-4: CSS Media Queries Stacking Check | ✅ PASS | - |
| Tier 2 | `T2_RadiusLowerLimit` | T2-1: Border Radius Lower Bound Check | ✅ PASS | - |
| Tier 2 | `T2_RadiusUpperLimit` | T2-2: Border Radius Upper Bound Check | ✅ PASS | - |
| Tier 2 | `T2_FontFallbackSerif` | T2-3: Serif Font Family Fallbacks | ✅ PASS | - |
| Tier 2 | `T2_FontFallbackSans` | T2-4: Sans-Serif Font Family Fallbacks | ✅ PASS | - |
| Tier 2 | `T2_MinWidthLimit` | T2-5: Responsive Minimum Width Protection | ❌ FAIL | Found hardcoded layout min-width of 1340px which breaks responsive layouts. (Matched in CSS: min-width: 1340px) |
| Tier 2 | `T2_MenuCollapseState` | T2-6: Mobile Drawer Navigation Collapse Logic | ❌ FAIL | No menu drawer boolean state toggle logic found in App.tsx. (App.tsx lacks active menu toggling state.) |
| Tier 2 | `T2_BorderOpacityLimit` | T2-7: Border Opacity Limits | ❌ FAIL | Visual system utilizes high opacity borders (0.22 - 0.35) which clash with the premium design. (Legacy high opacity borders found in CSS.) |
| Tier 2 | `T2_PaddingBounds` | T2-8: Layout Grid Padding Boundaries | ✅ PASS | - |
| Tier 2 | `T2_ShadowBounds` | T2-9: Box Shadow Intensity Limits | ✅ PASS | - |
| Tier 2 | `T2_ZIndexBounds` | T2-10: Layer Z-Index Boundaries Check | ✅ PASS | - |
| Tier 2 | `T2_OpacityBounds` | T2-11: Typography Opacity Readability Check | ✅ PASS | - |
| Tier 2 | `T2_TransitionDuration` | T2-12: Transition Timing Limits | ❌ FAIL | Found excessively long/slow transitions/animations (> 10s) associated with legacy visual effects. (Matched slow animation/transition definitions in CSS.) |
| Tier 2 | `T2_ImageObjectFit` | T2-13: Image Scale Object-Fit Verification | ❌ FAIL | No object-fit classes (object-cover/object-contain) detected for visual assets. (Ensure images have object-fit layout protection.) |
| Tier 2 | `T2_ButtonFocusState` | T2-14: Interactive Element Focus State Accessibility | ✅ PASS | - |
| Tier 2 | `T2_FlexWrapLimit` | T2-15: Flex Layout Wrap Settings | ✅ PASS | - |
| Tier 3 | `T3_F1_F2_Combined` | T3-1: Product Card Premium Refactoring (F1 + F2) | ❌ FAIL | Product cards (.pc-luxe) still utilize legacy hover glows (F1). (Found glow shadows under .pc-luxe:hover.) |
| Tier 3 | `T3_F2_F3_Combined` | T3-2: Responsive Section Borders and Grids (F2 + F3) | ❌ FAIL | Missing responsive grid column stacking override (F3) for B2B portal layouts. (Could not find .biz-grid column stacked media rules.) |
| Tier 3 | `T3_F1_F3_Combined` | T3-3: Clean Mobile Drawer Navigation (F1 + F3) | ✅ PASS | - |
| Tier 4 | `T4_B2CDiscoveryScenario` | T4-1: B2C Product Discovery Journey Styling | ❌ FAIL | B2C product discovery contains custom cursor logic/elements. (Legacy cursor references found in TSX/JS.) |
| Tier 4 | `T4_B2BWholesalePortal` | T4-2: B2B Wholesale Portal & Sourcing Tables Styling | ❌ FAIL | B2B wholesale portal uses legacy glowing divider lines. (x-gold-divider uses linear-gradient sweep.) |
| Tier 4 | `T4_MobileLayoutDrawer` | T4-3: Mobile Layout Responsive Hamburger Menu & Drawer | ✅ PASS | - |
| Tier 4 | `T4_DarkModeToggleSafety` | T4-4: Dark Mode Theme Styling Safety | ✅ PASS | - |
| Tier 4 | `T4_CheckoutSuccessScreen` | T4-5: Checkout & Inquiry Submission Success Screen | ✅ PASS | - |
| Tier 4 | `T4_AboutPageValidation` | T4-6: About Us Sourcing Story & Certifications Validation | ✅ PASS | - |
| Tier 4 | `T4_AdminDashboardStyling` | T4-7: Admin Dashboard Control Panel Styling | ✅ PASS | - |
