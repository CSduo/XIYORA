const fs = require('fs');
const path = require('path');

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
}

function parseRgba(str) {
  str = str.trim();
  if (str.startsWith('#')) return [...hexToRgb(str), 1.0];
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return [
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3]),
      match[4] !== undefined ? parseFloat(match[4]) : 1.0
    ];
  }
  return null;
}

function composite(fgRgba, bgRgb) {
  const alpha = fgRgba[3];
  return [
    Math.round(fgRgba[0] * alpha + bgRgb[0] * (1 - alpha)),
    Math.round(fgRgba[1] * alpha + bgRgb[1] * (1 - alpha)),
    Math.round(fgRgba[2] * alpha + bgRgb[2] * (1 - alpha))
  ];
}

function getLuminance([r, g, b]) {
  const [aR, aG, aB] = [r, g, b].map(v => {
    v = v / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * aR + 0.7152 * aG + 0.0722 * aB;
}

function contrastRatio(fgRgba, bgRgb) {
  const effectiveFg = fgRgba[3] < 1.0 ? composite(fgRgba, bgRgb) : [fgRgba[0], fgRgba[1], fgRgba[2]];
  const l1 = getLuminance(effectiveFg);
  const l2 = getLuminance(bgRgb);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

const testCases = [
  {
    name: ".btn-ivory text (#1A1A1A) on .btn-ivory bg (#F5F2ED)",
    fg: parseRgba("#1A1A1A"),
    bg: hexToRgb("#F5F2ED"),
    minRequired: 4.5,
    type: "Normal Text / Button"
  },
  {
    name: ".btn-ivory hover text (#FFFFFF) on dark hover bg (#1A1A1A)",
    fg: parseRgba("#FFFFFF"),
    bg: hexToRgb("#1A1A1A"),
    minRequired: 4.5,
    type: "Button Hover"
  },
  {
    name: ".sl / .sec-label (#C8C3BA) on dark bg (#1A1A1A)",
    fg: parseRgba("#C8C3BA"),
    bg: hexToRgb("#1A1A1A"),
    minRequired: 4.5,
    type: "Section Label"
  },
  {
    name: ".sl / .sec-label (#C8C3BA) on dark bg (#141414)",
    fg: parseRgba("#C8C3BA"),
    bg: hexToRgb("#141414"),
    minRequired: 4.5,
    type: "Section Label"
  },
  {
    name: ".gold-grad start color (#E5DFCD) on dark bg (#1A1A1A)",
    fg: parseRgba("#E5DFCD"),
    bg: hexToRgb("#1A1A1A"),
    minRequired: 4.5,
    type: "Gradient Text"
  },
  {
    name: ".gold-grad end color (#C8C3BA) on dark bg (#1A1A1A)",
    fg: parseRgba("#C8C3BA"),
    bg: hexToRgb("#1A1A1A"),
    minRequired: 4.5,
    type: "Gradient Text"
  },
  {
    name: ".gold-italic (#E8D6B4) on dark bg (#1A1A1A)",
    fg: parseRgba("#E8D6B4"),
    bg: hexToRgb("#1A1A1A"),
    minRequired: 4.5,
    type: "Italic Text"
  },
  {
    name: ".bo / .btn-gold-out (#F5EEF0) on dark bg (#1A1A1A)",
    fg: parseRgba("#F5EEF0"),
    bg: hexToRgb("#1A1A1A"),
    minRequired: 4.5,
    type: "Outline Button"
  },
  {
    name: "SimplePage card text (C.dark / #1A1A1A @ 0.85) on white bg (#FFFFFF)",
    fg: parseRgba("rgba(26,26,26,0.85)"),
    bg: hexToRgb("#FFFFFF"),
    minRequired: 4.5,
    type: "Card Body Copy"
  },
  {
    name: "Form labels (lbl class: rgba(245,242,237,0.85)) on dark modal (#141414)",
    fg: parseRgba("rgba(245,242,237,0.85)"),
    bg: hexToRgb("#141414"),
    minRequired: 4.5,
    type: "Form Label"
  },
  {
    name: "Input placeholders (rgba(245,242,237,0.65)) on dark input bg (#1C1C1A)",
    fg: parseRgba("rgba(245,242,237,0.65)"),
    bg: hexToRgb("#1C1C1A"),
    minRequired: 4.5,
    type: "Placeholder"
  },
  {
    name: "Discount strike price (rgba(255,255,255,0.75)) on dark card (#1E1E1C)",
    fg: parseRgba("rgba(255,255,255,0.75)"),
    bg: hexToRgb("#1E1E1C"),
    minRequired: 4.5,
    type: "Strike Price"
  },
  {
    name: "Footer address & copy (rgba(255,255,255,0.75)) on dark footer (#141414)",
    fg: parseRgba("rgba(255,255,255,0.75)"),
    bg: hexToRgb("#141414"),
    minRequired: 4.5,
    type: "Footer Copy"
  },
  {
    name: "AdminPanel Label (#D0C8B8) on dark panel (#1E1E1C)",
    fg: parseRgba("#D0C8B8"),
    bg: hexToRgb("#1E1E1C"),
    minRequired: 4.5,
    type: "Admin Form Label"
  },
  {
    name: "AdminPanel <th> header (#E5DFCD) on dark th bg (#181816)",
    fg: parseRgba("#E5DFCD"),
    bg: hexToRgb("#181816"),
    minRequired: 4.5,
    type: "Admin Table Header"
  },
  {
    name: "Hover category labels (.cat-card-explore: #F5F2ED) on dark card (#1E1E1C)",
    fg: parseRgba("#F5F2ED"),
    bg: hexToRgb("#1E1E1C"),
    minRequired: 4.5,
    type: "Category Card Text"
  }
];

console.log("=== EMPIRICAL WCAG AA CONTRAST RATIO VERIFICATION ===");
let totalPassed = 0;
let totalFailed = 0;

testCases.forEach(tc => {
  const ratio = contrastRatio(tc.fg, tc.bg);
  const passed = ratio >= tc.minRequired;
  if (passed) totalPassed++;
  else totalFailed++;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${tc.name}`);
  console.log(`       Type: ${tc.type} | Ratio: ${ratio.toFixed(2)}:1 (Min required: ${tc.minRequired}:1)`);
});

console.log(`\nResults: ${totalPassed} PASSED, ${totalFailed} FAILED out of ${testCases.length} test cases.`);

if (totalFailed > 0) {
  process.exit(1);
}
