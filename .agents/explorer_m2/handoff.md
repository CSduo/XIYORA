# Handoff Report — Milestone 2 Explorer

## 1. Observation
We investigated the visual/luxury system of the application inside `artifacts/xiyora/src/App.tsx` and `artifacts/xiyora/src/styles/luxe.css`.
Direct observations include the following:

### Gradient Orbs
- **luxe.css**:
  - Class definitions for gradient drift:
    ```css
    .x-orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      opacity: 0.18;
      animation: orbDrift 22s ease-in-out infinite;
      will-change: transform;
    }
    .x-orb-gold  { background: radial-gradient(circle, #C8A97E, transparent 70%); }
    .x-orb-ivory { background: radial-gradient(circle, #F0E6D0, transparent 70%); opacity: 0.1; }
    .x-orb-seal  { background: radial-gradient(circle, #9E3B2E, transparent 70%); opacity: 0.09; }
    @keyframes orbDrift {
      0%,100% { transform: translate(0, 0) scale(1); }
      33%     { transform: translate(30px, -40px) scale(1.06); }
      66%     { transform: translate(-20px, 25px) scale(0.96); }
    }
    ``` (lines 175-191)
  - Ambient glow animation:
    ```css
    @keyframes ambientPulse {
      0%, 100% { opacity: 0.18; transform: scale(1) translateY(0); }
      50% { opacity: 0.28; transform: scale(1.1) translateY(-10px); }
    }
    .ambient-glow-glow {
      animation: ambientPulse 8s ease-in-out infinite;
    }
    ``` (lines 644-650)
- **App.tsx**:
  - JSX rendering of orbs:
    - Line 1366: `<div className="x-orb x-orb-gold"  style={{width:360,height:360,top:"20%",left:"15%",opacity:.12}}/>`
    - Line 1367: `<div className="x-orb x-orb-seal"  style={{width:260,height:260,bottom:"18%",right:"20%",opacity:.08}}/>`
    - Lines 2209-2211:
      ```tsx
      <div className="x-orb x-orb-gold"  style={{width:500,height:500,top:"-10%",left:"30%",zIndex:0,position:"absolute"}}/>
      <div className="x-orb x-orb-seal"  style={{width:380,height:380,bottom:"-5%",right:"8%",zIndex:0,position:"absolute",animationDelay:"-4s"}}/>
      <div className="x-orb x-orb-ivory" style={{width:300,height:300,top:"20%",left:"-5%",zIndex:0,position:"absolute",animationDelay:"-8s"}}/>
      ```

### Custom Cursor
- **luxe.css**:
  - Classes `.xiyora-cursor`, `.xiyora-cursor.cursor-hover`, `.xiyora-cursor.cursor-click`, and `.xiyora-cursor-dot` (lines 6-50)
  - Responsive coarse override and body auto rule (lines 698-712)
- **App.tsx**:
  - `GoldCursor` component defined at lines 1388-1424:
    ```tsx
    /* ── Gold Magnetic Cursor ── */
    function GoldCursor(){
      const ringRef=useRef<HTMLDivElement>(null);
      const dotRef=useRef<HTMLDivElement>(null);
      ...
      return(<><div ref={ringRef} className="xiyora-cursor"/><div ref={dotRef} className="xiyora-cursor-dot"/></>);
    }
    ```
  - JSX render at line 7113: `<GoldCursor/>`

### 3D Tilt
- **luxe.css**:
  - `.tilt-card` and `.tilt-card::after` styles (lines 234-258)
  - `.perspective-1000`, `.tilt-3d`, `.tilt-3d-inner` styles (lines 625-641)
- **App.tsx**:
  - Component `CategoryCard` has 3D tilt handlers and styling (lines 4799-4868):
    ```tsx
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    ...
    const transformStyle = isHovered 
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    ```

### Shimmers
- **luxe.css**:
  - Morphing text shimmers: `@keyframes goldTextShimmer`, `.gold-shimmer-text` (lines 402-414)
  - Glow button shimmers: `.btn-luxe-glow`, `.btn-luxe-glow::before`, `@keyframes btnBorderAnim` (lines 417-437)
- **App.tsx**:
  - In global CSS: `@keyframes sweepBtn` (line 1577), `.bg::before` (lines 1594-1595), `@keyframes goldShimmer` (line 1851), `.gold-line-btn` (lines 1884-1886)
  - In JSX: `gold-line-btn` buttons on lines 3086 and 4788

### Particle Canvas
- **luxe.css**:
  - `.hero-particle-canvas` style (lines 346-352)
- **App.tsx**:
  - `HeroCanvas` component defined at lines 1426-1462:
    ```tsx
    /* ── Gold Particle Canvas (hero) ── */
    function HeroCanvas({height=620}:{height?:number}){
      const canvasRef=useRef<HTMLCanvasElement>(null);
      ...
    }
    ```
  - Rendered at line 2207: `<HeroCanvas height={520}/>`
  - Rendered at line 2356: `<HeroCanvas height={420}/>`

### Sakura Overlay
- **luxe.css**:
  - None.
- **App.tsx**:
  - In global CSS: `@keyframes petalFall`, `@keyframes petalSway`, `.petal-layer`, `.petal` (lines 1816-1820), and prefers-reduced-motion override at line 1843.
  - `Petals` component defined at lines 2143-2157:
    ```tsx
    /* Falling sakura petals overlay (CSS-only, reduced-motion safe) */
    function Petals({count=14,z=5}:{count?:number;z?:number}){
      ...
    }
    ```
  - JSX rendering: Lines 2204, 2319, 2355, 2438, 2808, 3004, 4768: `<Petals .../>`

### Rounding for Cards and Buttons
- **luxe.css** and **App.tsx** global `CSS` string contain explicit `border-radius` values (ranging from `2px` to `20px`) for cards (`.pc`, `.pc-luxe`, `.cc`, `.cat-card`, `.testimonial-card`, `.glass-card`, `.ql-card`, `.cat-intro`) and buttons (`.bg`, `.bo`, `.bd`, `.btn-gold-out`, `.btn-ivory`, `.bt-noir`, `.google-btn`).
- Overriding inline style `borderRadius` values inside React code using `!important` rule is required to ensure consistent rendering.

### Fine Borders
- The codebase uses various custom borders with color codes like `#C8A97E` (gold), `C.sand` (sand), `#d8c298` (ivory-gold), and `#3a3a3a`.

### Typography
- Serif: Playfair Display is preloaded in `index.html` (line 19) and correctly targets heading elements (`.serif`, `.cat-card-title`, `.gold-italic`, etc.).
- Sans-serif: Inter is preloaded in `index.html` (line 19) and targets body/description elements (`body`, `.bg`, `.bo`, `.bd`, `.inp`, etc.).

---

## 2. Logic Chain
1. To cleanly remove visual elements without breaking React/Vite/Tailwind compilation:
   - We must not delete component imports or functions that could cause missing reference compilation errors in TypeScript.
   - Replacing dynamic components (e.g. `GoldCursor`, `HeroCanvas`, `Petals`) with functional stubs returning `null` maintains valid component reference declarations while completely disabling them in the DOM.
2. In JSX blocks, removing the component elements and the orb divs completely eliminates the HTML overhead and prevents rendering.
3. For custom cursors, removing cursor tracking event listeners in `App.tsx` prevents runtime overhead and reverts to the default native cursor behavior.
4. For 3D Tilt in `CategoryCard`, removing event handlers (`onMouseMove`, `onMouseEnter`, `onMouseLeave`) and simplify `transform` styles creates a flat 2D layout.
5. For Rounding and Borders:
   - Inline styles like `style={{ borderRadius: 2 }}` will take precedence over standard CSS classes.
   - However, since React's inline style object does not support `!important`, adding a global override block with `!important` at the end of `luxe.css` and the injected `CSS` string inside `App.tsx` will successfully override all cards, buttons, and divider radii/borders cleanly in 2D.
6. Typography is correctly declared globally, aligning with requirements.

---

## 3. Caveats
- Some inline styles may be applied to inputs or text containers which are not categorized under standard cards, buttons, or dividers. However, our override targets all standard buttons, cards, and horizontal lines (`hr`).
- The project's background API server currently fails compiler check on an unrelated upload route handler (`TS18048` warning on `req.file`), but this does not affect the compilation of the `xiyora` client package.

---

## 4. Conclusion
We have mapped out the exact changes required to perform the luxury styling removal and implement the premium 2D design. The Worker can execute these changes safely by following the precise instructions below.

### Proposed Changes: File 1 — `artifacts/xiyora/src/styles/luxe.css`

#### Step 1: Remove Custom Cursor styles
Remove or comment out lines 6 to 50:
```css
/* ── 1. CUSTOM MAGNETIC CURSOR ──────────────────────────────── */
/*
@media (pointer: coarse) {
  .xiyora-cursor, .xiyora-cursor-dot { display: none !important; }
}
.xiyora-cursor {
  ...
}
.xiyora-cursor-dot {
  ...
}
*/
```
And lines 698 to 712:
```css
/* ── CURSOR: ensure native cursor is always visible ── */
/*
html, body, * {
  ...
}
*/
```

#### Step 2: Remove Ambient Gradient Orbs styles
Remove or comment out lines 174 to 191:
```css
/* ── 3. AMBIENT GRADIENT ORBS ───────────────────────────────── */
/*
.x-orb {
  ...
}
.x-orb-gold  { ... }
.x-orb-ivory { ... }
.x-orb-seal  { ... }
@keyframes orbDrift {
  ...
}
*/
```
And lines 643 to 650:
```css
/*
@keyframes ambientPulse {
  ...
}
.ambient-glow-glow {
  ...
}
*/
```

#### Step 3: Remove 3D Tilt styles
Remove or comment out lines 233 to 258:
```css
/* ── 5. 3D CARD TILT SHIMMER ────────────────────────────────── */
/*
.tilt-card {
  ...
}
.tilt-card::after {
  ...
}
.tilt-card:hover::after { opacity: 1; }
*/
```
And lines 625 to 641:
```css
/*
.perspective-1000 {
  ...
}
.tilt-3d {
  ...
}
.tilt-3d:hover {
  ...
}
.tilt-3d-inner {
  ...
}
*/
```

#### Step 4: Remove Shimmers styles
Remove or comment out lines 401 to 437:
```css
/* ── 12. MORPHING GRADIENT HERO TEXT ─────────────────────────── */
/*
@keyframes goldTextShimmer {
  ...
}
.gold-shimmer-text {
  ...
}
*/

/* ── 13. ENHANCED BUTTON EFFECTS ─────────────────────────────── */
/*
.btn-luxe-glow {
  ...
}
.btn-luxe-glow::before {
  ...
}
@keyframes btnBorderAnim {
  ...
}
*/
```

#### Step 5: Remove Particle Canvas styles
Remove or comment out lines 345 to 352:
```css
/* ── 9. HERO CANVAS CONTAINER ────────────────────────────────── */
/*
.hero-particle-canvas {
  ...
}
*/
```

#### Step 6: Update Card / Badge border-radius and borders
Update `.pc-luxe` (lines 313-325) and `.stat-badge` (lines 355-367) and `.testimonial-card` (lines 478-486) and `.glass-card` (lines 607-616) to replace previous border/rounding values with the new guidelines:
```css
.pc-luxe {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  background: #141008;
  border: 1px solid rgba(246, 239, 224, 0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  transition:
    box-shadow 0.5s cubic-bezier(.22,1,.36,1),
    transform 0.5s cubic-bezier(.22,1,.36,1);
  cursor: pointer;
}

.stat-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 20px;
  border: 1px solid rgba(246, 239, 224, 0.08);
  border-radius: 2rem;
  background: rgba(200,169,126,0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.4s, background 0.4s;
}

.testimonial-card {
  background: rgba(20,16,10,0.8);
  border: 1px solid rgba(246, 239, 224, 0.08);
  border-radius: 2rem;
  padding: 28px 26px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.4s, transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
}

.glass-card {
  background: rgba(28, 22, 17, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(246, 239, 224, 0.08);
  border-radius: 2rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(.22,1,.36,1);
}
```

#### Step 7: Append Global Overrides to the end of `luxe.css`
Append the following override rules to the end of the file:
```css
/* ── 24. MILESTONE 2: 2D GLOBAL OVERRIDES ────────────────────── */
/* Cards organic rounding & fine border */
.pc, .pc-luxe, .cc, .cat-card, .testimonial-card, .glass-card, .ql-card, .cat-intro {
  border-radius: 2rem !important; /* 32px */
  border: 1px solid rgba(246, 239, 224, 0.08) !important;
}

/* Buttons organic rounding & fine border */
button, .bg, .bo, .bd, .btn-gold-out, .btn-ivory, .bt-noir, .google-btn {
  border-radius: 2rem !important; /* 32px */
  border: 1px solid rgba(246, 239, 224, 0.08) !important;
}

/* Dividers fine border */
.x-gold-divider, hr {
  border: none !important;
  height: 1px !important;
  background: rgba(246, 239, 224, 0.08) !important;
}
```

---

### Proposed Changes: File 2 — `artifacts/xiyora/src/App.tsx`

#### Step 1: Replace Custom Cursor component with stub
Replace lines 1389-1424 with a stub that returns `null`:
```tsx
function GoldCursor(){
  return null;
}
```

#### Step 2: Remove Custom Cursor element from JSX
At line 7113, replace:
```tsx
    <GoldCursor/>
```
with:
```tsx
    {/* <GoldCursor/> */}
```

#### Step 3: Replace Particle Canvas component with stub
Replace lines 1427-1462 with a stub that returns `null`:
```tsx
function HeroCanvas({height=620}:{height?:number}){
  return null;
}
```

#### Step 4: Remove Particle Canvas elements from JSX
- At line 2207, remove `<HeroCanvas height={520}/>`.
- At line 2356, remove `<HeroCanvas height={420}/>`.

#### Step 5: Replace Sakura Overlay component with stub
Replace lines 2144-2157 with a stub that returns `null`:
```tsx
function Petals({count=14,z=5}:{count?:number;z?:number}){
  return null;
}
```

#### Step 6: Remove Sakura Overlay elements from JSX
- Remove `<Petals count={16}/>` from line 2204.
- Remove `<Petals count={10}/>` from line 2319.
- Remove `<Petals count={12}/>` from line 2355.
- Remove `<Petals count={8}/>` from line 2438.
- Remove `<Petals count={14}/>` from line 2808.
- Remove `<Petals count={8}/>` from line 3004.
- Remove `<Petals count={8}/>` from line 4768.

#### Step 7: Remove Gradient Orbs elements from JSX
- Remove these lines (originally lines 1366, 1367):
  ```tsx
  <div className="x-orb x-orb-gold"  style={{width:360,height:360,top:"20%",left:"15%",opacity:.12}}/>
  <div className="x-orb x-orb-seal"  style={{width:260,height:260,bottom:"18%",right:"20%",opacity:.08}}/>
  ```
- Remove these lines (originally lines 2209-2211):
  ```tsx
  <div className="x-orb x-orb-gold"  style={{width:500,height:500,top:"-10%",left:"30%",zIndex:0,position:"absolute"}}/>
  <div className="x-orb x-orb-seal"  style={{width:380,height:380,bottom:"-5%",right:"8%",zIndex:0,position:"absolute",animationDelay:"-4s"}}/>
  <div className="x-orb x-orb-ivory" style={{width:300,height:300,top:"20%",left:"-5%",zIndex:0,position:"absolute",animationDelay:"-8s"}}/>
  ```

#### Step 8: Remove Shimmer class names from JSX buttons
- At line 3086, change:
  ```tsx
  <button className="btn-gold-out gold-line-btn xiyora-gold-button"
  ```
  to:
  ```tsx
  <button className="btn-gold-out xiyora-gold-button"
  ```
- At line 4788, change:
  ```tsx
  <button className="btn-gold-out gold-line-btn xiyora-gold-button"
  ```
  to:
  ```tsx
  <button className="btn-gold-out xiyora-gold-button"
  ```

#### Step 9: Remove Shimmer styles from the global `CSS` string
- Comment out or delete keyframe `@keyframes sweepBtn` on line 1577:
  ```css
  /* @keyframes sweepBtn{0%{left:-60%}100%{left:120%}} */
  ```
- Remove hover sweep rule from `.bg` on line 1595:
  ```css
  /* .bg:hover::before{animation:sweepBtn .5s ease forwards} */
  ```
- Comment out or delete keyframe `@keyframes goldShimmer` on line 1851:
  ```css
  /* @keyframes goldShimmer{0%{background-position:-180% 0}100%{background-position:180% 0}} */
  ```
- Comment out or delete `.gold-line-btn` rules on lines 1884-1887:
  ```css
  /*
  .gold-line-btn{position:relative;overflow:hidden}
  .gold-line-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,240,205,.45) 50%,transparent 70%);background-size:220% 100%;background-position:-180% 0;pointer-events:none}
  .gold-line-btn:hover::before{animation:goldShimmer 1.1s ease}
  */
  ```

#### Step 10: Replace `CategoryCard` with a flat 2D version
Replace `CategoryCard` component (lines 4799-4868) with:
```tsx
function CategoryCard({img,name,sub,cn,wide,onClick}:{img:string;name:string;sub:string;cn?:string;wide?:boolean;onClick:()=>void}){
  const [imgErr,setImgErr]=useState(false);
  return(
    <button 
      type="button" 
      onClick={onClick} 
      aria-label={`${name} — ${sub}`} 
      className={"cat-card glass-card"+(wide?" cat-card-wide":"")}
    >
      <img 
        src={imgErr?FALLBACK_IMG:img} 
        alt={name} 
        className="cat-card-img" 
        loading="lazy" 
        decoding="async" 
        onError={()=>setImgErr(true)}
      />
      <div className="cat-card-grad" />
      <span className="cat-corner tl" aria-hidden />
      <span className="cat-corner tr" aria-hidden />
      {cn&&<span className="cat-vtag" aria-hidden>{cn}</span>}
      <div className="cat-card-body">
        <div className="cat-card-title">{name}</div>
        <div className="cat-card-sub">{sub}</div>
        <span className="cat-card-explore">Explore <span className="cat-card-arr">→</span></span>
      </div>
    </button>
  );
}
```

#### Step 11: Update Card / Button border-radius and borders inside global `CSS` string
Inside the `const CSS = \` ... \`` block, update:
- Line 1593: Change `.bg` border-radius to `2rem`.
- Line 1598: Change `.bo` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1600: Change `.bd` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1604: Change `.pc` border-radius to `2rem`.
- Line 1608: Change `.cc` border-radius to `2rem`.
- Line 1633: Change `.glass-modal` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1634: Change `.google-btn` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1811: Change `.btn-gold-out` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1813: Change `.btn-ivory` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1856: Change `.gold-badge` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1859: Change `.ql-card` border-radius to `2rem`.
- Line 1874: Change `.bt-noir` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1877: Change `.cat-intro` border-radius to `2rem` and border to `1px solid rgba(246, 239, 224, 0.08)`.
- Line 1892: Change `.cat-card` border-radius to `2rem`.

#### Step 12: Append Global Overrides inside the global `CSS` string
At the very end of the global `CSS` string (right before the closing backtick on line 1911), append:
```css
/* Cards organic rounding & fine border */
.pc, .pc-luxe, .cc, .cat-card, .testimonial-card, .glass-card, .ql-card, .cat-intro {
  border-radius: 2rem !important;
  border: 1px solid rgba(246, 239, 224, 0.08) !important;
}

/* Buttons organic rounding & fine border */
button, .bg, .bo, .bd, .btn-gold-out, .btn-ivory, .bt-noir, .google-btn {
  border-radius: 2rem !important;
  border: 1px solid rgba(246, 239, 224, 0.08) !important;
}

/* Dividers fine border */
.x-gold-divider, hr {
  border: none !important;
  height: 1px !important;
  background: rgba(246, 239, 224, 0.08) !important;
}
```

---

## 5. Verification Method
To independently verify the changes, the Worker must execute:
1. Run local typecheck to ensure TypeScript compilation is successful:
   `pnpm --filter "@workspace/xiyora" run typecheck`
2. Run local build to ensure Vite builds successfully:
   `pnpm --filter "@workspace/xiyora" run build`
3. Launch development server:
   `pnpm --filter "@workspace/xiyora" run dev`
4. Inspect elements on the web browser:
   - Ensure the native browser cursor is active.
   - Verify the sakura overlay and particle canvases are completely absent.
   - Verify cards and buttons are rounded with 32px organic rounding.
   - Verify the dividers, cards, and buttons utilize the fine borders.
