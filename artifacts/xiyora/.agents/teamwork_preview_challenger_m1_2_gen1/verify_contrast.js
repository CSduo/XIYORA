// verify_contrast.js
// Programmatic contrast verification for Milestone M1

function sRGBtoLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
  const rL = sRGBtoLinear(r);
  const gL = sRGBtoLinear(g);
  const bL = sRGBtoLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

function blendRGBA(fg, bg) {
  // fg: [r, g, b, a], bg: [r, g, b]
  const a = fg[3];
  const r = Math.round(fg[0] * a + bg[0] * (1 - a));
  const g = Math.round(fg[1] * a + bg[1] * (1 - a));
  const b = Math.round(fg[2] * a + bg[2] * (1 - a));
  return [r, g, b];
}

const tests = [
  // 1. luxe.css classes
  {
    name: ".btn-ivory normal state (text #1A1A1A on #F5F2ED bg)",
    fg: [26, 26, 26],
    bg: [245, 242, 237],
    target: 4.5,
    type: "normal text / button"
  },
  {
    name: ".btn-ivory hover state (text #FFFFFF on #1A1A1A bg)",
    fg: [255, 255, 255],
    bg: [26, 26, 26],
    target: 4.5,
    type: "normal text / button"
  },
  {
    name: ".sl, .sec-label (text #C8C3BA on #141414 bg)",
    fg: [200, 195, 186],
    bg: [20, 20, 20],
    target: 4.5,
    type: "section label"
  },
  {
    name: ".gold-grad start token (text #E5DFCD on #141414 bg)",
    fg: [229, 223, 205],
    bg: [20, 20, 20],
    target: 4.5,
    type: "gradient text"
  },
  {
    name: ".gold-grad end token (text #C8C3BA on #141414 bg)",
    fg: [200, 195, 186],
    bg: [20, 20, 20],
    target: 4.5,
    type: "gradient text"
  },
  {
    name: ".gold-italic (text #E8D6B4 on #141414 bg)",
    fg: [232, 214, 180],
    bg: [20, 20, 20],
    target: 4.5,
    type: "italic heading text"
  },
  {
    name: ".bo, .btn-gold-out normal state (text #F5EEF0 on #141414 bg)",
    fg: [245, 238, 240],
    bg: [20, 20, 20],
    target: 4.5,
    type: "outline button"
  },
  {
    name: ".bo, .btn-gold-out hover state (text #FFFFFF on #141414 bg)",
    fg: [255, 255, 255],
    bg: [20, 20, 20],
    target: 4.5,
    type: "outline button hover"
  },
  {
    name: ".cat-card-explore / .ql-arrow / .ci-label / .x-link:hover (text #F5F2ED on #141414 bg)",
    fg: [245, 242, 237],
    bg: [20, 20, 20],
    target: 4.5,
    type: "interactive / label hover"
  },
  
  // 2. App.tsx inline styles
  {
    name: "SimplePage paragraph text (C.dark #1A1A1A at 0.85 opacity on white #FFFFFF bg)",
    fgBlend: [26, 26, 26, 0.85],
    bg: [255, 255, 255],
    target: 4.5,
    type: "body copy"
  },
  {
    name: "SubscribeModal form label 'lbl' (rgba(245,242,237,0.85) on dark #141414 bg)",
    fgBlend: [245, 242, 237, 0.85],
    bg: [20, 20, 20],
    target: 4.5,
    type: "form label"
  },
  {
    name: "Form input placeholder (rgba(245,242,237,0.65) on #222222 bg)",
    fgBlend: [245, 242, 237, 0.65],
    bg: [34, 34, 34],
    target: 4.5,
    type: "placeholder text"
  },
  {
    name: "PCard discount strike price (rgba(255,255,255,0.75) on #1E1E1C bg)",
    fgBlend: [255, 255, 255, 0.75],
    bg: [30, 30, 28],
    target: 4.5,
    type: "strike price"
  },
  {
    name: "Footer address & copyright (rgba(255,255,255,0.75) on #141414 bg)",
    fgBlend: [255, 255, 255, 0.75],
    bg: [20, 20, 20],
    target: 4.5,
    type: "footer text"
  },

  // 3. AdminPanel.tsx components
  {
    name: "AdminPanel <Label> text (#D0C8B8 on dark admin bg #1E1E1C)",
    fg: [208, 200, 184],
    bg: [30, 30, 28],
    target: 4.5,
    type: "admin form label"
  },
  {
    name: "AdminPanel <th> table headers (#E5DFCD on dark admin bg #1E1E1C)",
    fg: [229, 223, 205],
    bg: [30, 30, 28],
    target: 4.5,
    type: "admin table header"
  },
  {
    name: "AdminPanel subtext/specs label (#D0C8B8 on dark panel #1E1E1C)",
    fg: [208, 200, 184],
    bg: [30, 30, 28],
    target: 4.5,
    type: "admin helper text"
  }
];

let failed = 0;
console.log("=== WCAG AA CONTRAST RATIO EMPIRICAL TEST SUITE ===");
console.log("");

tests.forEach((t) => {
  const fg = t.fgBlend ? blendRGBA(t.fgBlend, t.bg) : t.fg;
  const ratio = getContrastRatio(fg, t.bg);
  const passed = ratio >= t.target;
  if (!passed) failed++;

  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${t.name}`);
  console.log(`       Category: ${t.type}`);
  console.log(`       Computed FG RGB: rgb(${fg.join(', ')})`);
  console.log(`       BG RGB: rgb(${t.bg.join(', ')})`);
  console.log(`       Contrast Ratio: ${ratio.toFixed(2)}:1 (Required: >= ${t.target}:1)`);
  console.log("");
});

console.log(`Summary: ${tests.length - failed}/${tests.length} passed.`);
if (failed > 0) {
  console.error(`FAILED: ${failed} WCAG AA contrast violations found!`);
  process.exit(1);
} else {
  console.log("ALL CONTRAST TESTS PASSED PERFECTLY!");
}
