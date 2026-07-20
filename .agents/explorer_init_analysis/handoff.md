# XIYORA Visual Codebase Investigation & Recommendations

**Milestone**: Initial Codebase Exploration & Analysis  
**Date**: 2026-07-17T07:18:00+05:30  
**Status**: COMPLETE (Read-Only Investigation Phase)

---

## 1. Observation

The investigation of the XIYORA website codebase located in `artifacts/xiyora` yielded the following direct observations regarding layout, visual effects, typography, configuration, and responsiveness:

### 1.1 Custom Trailing Cursors
* **React Implementation**: A dedicated React component called `GoldCursor` is defined in `src/App.tsx` at lines 1389–1424. It tracks the mouse coordinates in a ref and uses linear interpolation (`lerp` with a factor of `0.12`) inside a `requestAnimationFrame` animation loop to calculate a smooth trailing effect for a cursor ring and dot.
  ```typescript
  // src/App.tsx (lines 1389-1424)
  function GoldCursor(){
    const ringRef=useRef<HTMLDivElement>(null);
    const dotRef=useRef<HTMLDivElement>(null);
    const pos=useRef({x:0,y:0});
    const ringPos=useRef({x:0,y:0});
    useEffect(()=>{
      if(typeof window==="undefined"||window.matchMedia("(pointer:coarse)").matches)return;
      const onMove=(e:MouseEvent)=>{pos.current={x:e.clientX,y:e.clientY};};
      // ... event listeners for mousedown, mouseup, mouseover, mouseout ...
      const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
      const tick=()=>{
        ringPos.current.x=lerp(ringPos.current.x,pos.current.x,0.12);
        ringPos.current.y=lerp(ringPos.current.y,pos.current.y,0.12);
        if(ringRef.current)ringRef.current.style.transform=`translate(${ringPos.current.x}px,${ringPos.current.y}px) translate(-50%,-50%)`;
        if(dotRef.current)dotRef.current.style.transform=`translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`;
        raf=requestAnimationFrame(tick);
      };
      // ...
    },[]);
    return(<><div ref={ringRef} className="xiyora-cursor"/><div ref={dotRef} className="xiyora-cursor-dot"/></>);
  }
  ```
* **CSS Definitions**: The style classes `.xiyora-cursor` and `.xiyora-cursor-dot` are defined in `src/styles/luxe.css` at lines 6–50 and 703–708. 
  * Native cursor is kept visible (defined via `body { cursor: auto }`).
  * Custom cursors are hidden on touch-screen devices using the `@media (pointer: coarse)` query in CSS (lines 7-9, 703-708) and the JS check `window.matchMedia("(pointer:coarse)").matches` (line 1396).
  * Hover states add `.cursor-hover` (increases ring size to 64px, adds gold tint, lines 28–33) and click states add `.cursor-click` (decreases size, lines 34–37).

### 1.2 Background Gradient Orbs (`.x-orb`)
* **CSS Definitions**: Styled in `src/styles/luxe.css` at lines 174–191.
  * Base class `.x-orb` defines `filter: blur(80px); opacity: 0.18;` and a drift animation `orbDrift` over a 22-second cycle.
  * Variations include `.x-orb-gold` (radial gold gradient), `.x-orb-ivory` (radial ivory gradient, opacity 0.1), and `.x-orb-seal` (radial reddish-brown gradient, opacity 0.09).
* **DOM Placement**: Placed as absolute-positioned decorative background elements inside `src/App.tsx`:
  * Inside `LoadingScreen` (lines 1366–1367) with `opacity: .12` and `.08`.
  * Inside `DarkHomeHero` (lines 2209–2211) as large backdrop depth layers.

### 1.3 3D Tilt, Shimmer, Glowing Borders, Neon Shadows, and Canvas
* **3D Card Tilt**: Implemented in React for the `CategoryCard` component in `src/App.tsx` (lines 4801–4828). Mouse movement calculations translate mouse coordinates to rotation angles (`-16deg` to `16deg` range):
  ```typescript
  const rotateX = ((y / rect.height) - 0.5) * -16; 
  const rotateY = ((x / rect.width) - 0.5) * 16;
  ```
  It applies the dynamic style `transform: perspective(1000px) rotateX(...) rotateY(...) scale3d(1.02, 1.02, 1.02)` to the button container. Child elements use `translateZ` to achieve a physical depth parallax (e.g., Image: `translateZ(10px) scale(1.05)`, Title: `translateZ(20px)`). Supporting CSS classes `.tilt-3d` and `.tilt-3d-inner` reside in `luxe.css` lines 625–642.
* **Card Hover Shimmer**: Styled in `src/styles/luxe.css` lines 234–258 under `.tilt-card`. It uses a absolute pseudo-element `::after` with a multi-stop gold/ivory linear gradient which transitions from `opacity: 0` to `opacity: 1` on hover to simulate a light-reflection sweep.
* **Floating Text Shimmers**: `.gold-shimmer-text` is defined in `luxe.css` lines 401–414. It uses a gold-to-ivory linear gradient, sets `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent`, and runs `@keyframes goldTextShimmer` to animate background position infinitely.
* **Glowing Borders & Neon Shadows**:
  * Product cards (`.pc-luxe` in `luxe.css` lines 313–344) utilize `@keyframes goldBorderPulse` to pulsate a thin gold border outline on hover, combined with deep expanding box shadows.
  * Glass cards (`.glass-card` in `luxe.css` lines 607–624) combine background blur (`backdrop-filter: blur(16px)`), high-transparency gold borders, and ambient gold glow shadows.
* **Particle Canvases**: Defined as a React component `HeroCanvas` in `src/App.tsx` lines 1427–1462. It renders 55 floating, fading particle dots using canvas context (`ctx.createRadialGradient`) inside a `requestAnimationFrame` loop.
* **Sakura Petals Overlay**: Component `Petals` in `src/App.tsx` lines 2144–2157 renders falling particles styled via CSS rules in `src/App.tsx` lines 1816–1820 (`.petal`, `.petal-layer`, `.petal i` with radial rose-to-red gradients).

### 1.4 Typography Styling
* **Font Loading**: Synchronously loaded in the `<head>` of `index.html` at lines 17–19 via Google Fonts:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
* **Font Styling Rules**:
  * **Playfair Display** (luxury serif): Configured under `.xl-brand` (loader brand name), `.xl-count-num`, `.stat-badge .sb-num`, `.testimonial-card::before` (large quote mark), `.gold-grad`, and headings/descriptions. The utility class `.serif` (line 1743) and React helper component `SH` (line 1920) default to this font.
  * **Inter** (modern sans-serif): Configured for all body text, labels, buttons, and subheadings (e.g., `body`, `.xl-sub`, `.xl-count-label`, `.lux-marquee-item`, `.stat-badge .sb-label`, `.x-discount-badge`, `.x-link`).

### 1.5 Organic Rounding
* Card, button, and badge rounding is defined in multiple CSS blocks with specific pixel coordinates:
  * **Product Cards** (`.pc-luxe`): `border-radius: 4px` (in `luxe.css` line 316).
  * **Category Cards** (`.cat-card`): `border-radius: 7px` (in `App.tsx` line 1892).
  * **Stat Badges** (`.stat-badge`): `border-radius: 8px` (in `luxe.css` line 362).
  * **Testimonial Cards** (`.testimonial-card`): `border-radius: 8px` (in `luxe.css` line 481).
  * **Buttons** (`.btn-gold-out`, `.btn-ivory`): `border-radius: 2px` (in `App.tsx` lines 1811, 1813).
  * **Chips** (`.cert-chip`, `.bt-chip`): `border-radius: 20px` (line 1711) and `30px` (line 1739) for capsule rounding.

### 1.6 Solid Borders
* **Current Border Styles**: Outlines and dividers are styled using thin borders with a gold/sand hue:
  * `.glass-card` uses `border: 1px solid rgba(200, 169, 126, 0.22);` (in `luxe.css` line 611).
  * `.pc-luxe` uses `box-shadow: 0 0 0 1px rgba(200, 169, 126, 0.22);` (in `luxe.css` line 319).
  * `.stat-badge` uses `border: 1px solid rgba(200, 169, 126, 0.35);` (in `luxe.css` line 361).
  * `.testimonial-card` uses `border: 1px solid rgba(200, 169, 126, 0.25);` (in `luxe.css` line 480).
  * Section dividers `.x-gold-divider` use gold linear gradients (in `luxe.css` lines 301–310).
  * Container dividers in `App.tsx` use `border: "1px solid rgba(200,169,126,.34)"` (line 4785).

### 1.7 Build Configuration and Dependency Structure
* **Vite Bundler**: Managed in `vite.config.ts`. Outputs built files to `dist/public` (line 54). Enforces strict port serving and maps `@/*` path aliases to `./src/*` (line 48).
* **Tailwind v4 Integration**: Uses the official `@tailwindcss/vite` plugin (line 3 and 45). Since Tailwind v4 operates directly as a compiler plugin without a `tailwind.config.js` file, it scans JS/TSX files and automatically injects compiled utilities.
* **TSConfig**: Configured in `tsconfig.json` (extends `../../tsconfig.base.json`, defines target environments, path aliases, type references).
* **Package.json**: Part of a PNPM monorepo (name: `@workspace/xiyora`). Contains standard scripts (`dev`, `build`, `serve`, `typecheck`). DevDependencies include `@tailwindcss/vite`, `wouter` (routing), `framer-motion`, and `@radix-ui` primitives.

### 1.8 Mobile Responsiveness
* **Critical CSS in HTML**: `index.html` contains a synchronous `<style>` block (lines 20-75) that applies layout stacked rules (for `.lux-hero-photo`, `.lux-hero-grid`, `.biz-grid`, `.sdrawer`) on first paint. This prevents layout shift (CLS) before React mounts.
* **CSS Media Queries**: 
  * `luxe.css` contains media queries for stats layout (lines 595-604), navbar hamburger/logo adaptations (lines 652-694), and hero grid stack overrides (lines 727-750).
  * `App.tsx` contains queries in its global `CSS` string for sidebar drawer (`.sdrawer` line 1704), navigation cartouche scaling, and responsive grids (lines 1829-1837).
* **Hamburger Menu**: Mobile header shows a hamburger button (`.nav-hamburger` in `App.tsx` line 5665) on screens below `1340px`. Clicking it opens the side drawer `SideDrawer` containing drawer links `.sdr-link`.
* **Mobile Hook**: React hook `useIsMobile()` in `src/hooks/use-mobile.tsx` checks if screen width is below `768px` using matchMedia.

---

## 2. Logic Chain

1. **Style Injection Mechanism**: Stylesheets are loaded via two distinct mechanisms:
   * Direct static file import: `import "./styles/luxe.css";` on line 2 of `src/App.tsx`.
   * Dynamic DOM injection: The massive `const CSS` string is injected via a `useEffect` hook (`s.textContent = CSS`) on lines 6922-6924 of `src/App.tsx`.
   * Dynamic Dark Mode: The `const DARK_CSS` string is similarly injected (`dk.textContent = DARK_CSS`) on lines 6925-6929 when `theme === "dark"`.
   * Inline Dynamic Styles: Component-level settings (like BIZ paddings/sizes) are injected as string templates inside a `<style>` block in the root return of `App.tsx` (lines 7079-7085).
2. **Implementing Custom Rounding**: To apply organic rounding (e.g. `rounded-[2rem]` or `rounded-[3rem]`):
   * Tailwind CSS v4 is compiled via Vite, meaning we can use these utility classes directly in JSX code.
   * However, because the visual elements like `.pc-luxe` and `.cat-card` have hardcoded pixel values (`border-radius: 4px`, `border-radius: 7px`) in stylesheet strings, applying `rounded-[2rem]` to their containers in JSX may not override them unless the custom CSS rule is changed or marked as `!important`.
   * Therefore, we must replace the pixel values in `luxe.css` and the injected `CSS` string in `App.tsx` with equivalent rem/em measurements (e.g. `32px` for `2rem`, `48px` for `3rem`), or use Tailwind classes by stripping out the hardcoded `border-radius` rules from the stylesheet.
3. **Implementing Solid Borders**: To apply `1px solid rgba(246, 239, 224, 0.08)`:
   * The requested color `rgba(246, 239, 224, 0.08)` corresponds to a 8% opacity ivory/cream tone.
   * Currently, borders use a thin gold outline `rgba(200, 169, 126, 0.22)`.
   * Replacing this gold color with the ivory color in `.glass-card` (in `luxe.css` line 611) and panel borders (in `App.tsx` line 4785) will produce cleaner, more modern solid borders suited for dark backgrounds.

---

## 3. Caveats

* **Coarse Pointers**: Custom cursors are disabled automatically on touch interfaces (using both CSS media query and JS matchMedia). Therefore, testing cursors must be done with a fine pointer (mouse/trackpad).
* **Tailwind v4 Setup**: There is no `tailwind.config.js`. Theme extensions or utility additions in Tailwind v4 must be declared in CSS using `@theme` or `@utility` directives if they are not standard utilities. Standard arbitrary utilities like `rounded-[2rem]` will work out-of-the-box.
* **Large File Maintenance**: `src/App.tsx` is over 7,000 lines long and contains major page components. Any edits to layout classes or CSS variables within `App.tsx` must target the correct lines in `const CSS` or within specific sub-components (like `Navbar`, `PCard`, `CategoryCard`).

---

## 4. Conclusion

1. **Custom Trailing Cursors**: Located in `src/App.tsx` (lines 1389–1424, component `GoldCursor`) and styled in `src/styles/luxe.css` (lines 6–50).
2. **Background Orbs**: Located in `src/styles/luxe.css` (lines 174–191) and instantiated in `src/App.tsx` (lines 1366–1367, 2209–2211).
3. **3D Tilt, Shimmer, Glowing Borders, Neon Shadows, Canvas**:
   * 3D Card Tilt: React mouse handlers in `CategoryCard` (lines 4801–4828) + `.tilt-3d` in `luxe.css`.
   * Shimmers/Glows/Shadows: Styled in `luxe.css` under `.tilt-card::after`, `.gold-shimmer-text`, `.pc-luxe`, and `.glass-card`.
   * Canvas: React component `HeroCanvas` in `src/App.tsx` (lines 1427–1462).
4. **Typography**: Configured in `index.html` (font link loader) and declared inside `luxe.css` and injected `CSS` variable inside `App.tsx` using `Playfair Display` and `Inter`.
5. **Organic Rounding**:
   * Recommendation: Modify the hardcoded `border-radius` declarations:
     * In `luxe.css` line 316 (change `.pc-luxe` to `border-radius: 2rem;` or `3rem;`).
     * In `App.tsx` line 1892 (change `.cat-card` to `border-radius: 2rem;` or `3rem;`).
     * Change `.stat-badge` and `.testimonial-card` to `2rem` or `3rem` to match.
6. **Solid Borders**:
   * Recommendation: Replace `rgba(200, 169, 126, 0.22)` (gold border) and other gold/sand outlines with `rgba(246, 239, 224, 0.08)` inside `src/styles/luxe.css` and `src/App.tsx` to establish the requested solid ivory borders.
7. **Build Config**: Managed by Vite + Tailwind v4 direct plugin integration. Custom stylesheet injection hook is at lines 6922-6930 in `src/App.tsx`.
8. **Mobile Responsiveness**: Critical layout rules in `index.html` head, media queries in `luxe.css` and `App.tsx` `CSS` string, and React responsive breakpoint handled via `useIsMobile()` hook.

---

## 5. Verification Method

To verify code changes and build compliance, run the following commands within the `artifacts/xiyora` directory:
1. **Build Project**: Run `pnpm run build` (or `npm run build` depending on workspace manager). This compiles Vite assets, runs the Tailwind v4 compiler, and verifies syntax correctness.
2. **Type Check**: Run `pnpm run typecheck` to verify that no TypeScript compilation errors have been introduced.
3. **Visual Inspections**:
   * Open `index.html` to confirm Google Fonts are loaded.
   * View `src/styles/luxe.css` and `src/App.tsx` to verify custom border and rounding adjustments.
