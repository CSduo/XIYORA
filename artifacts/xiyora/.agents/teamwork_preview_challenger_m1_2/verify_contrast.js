import fs from 'fs';
import path from 'path';

// WCAG Luminance and Contrast functions
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

function parseHex(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const num = parseInt(hex, 16);
  return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
}

function parseRgba(rgbaStr) {
  const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] !== undefined ? parseFloat(match[4]) : 1.0
    ];
  }
  return null;
}

function blendRgba(fgRgb, fgAlpha, bgRgb) {
  return [
    Math.round(fgAlpha * fgRgb[0] + (1 - fgAlpha) * bgRgb[0]),
    Math.round(fgAlpha * fgRgb[1] + (1 - fgAlpha) * bgRgb[1]),
    Math.round(fgAlpha * fgRgb[2] + (1 - fgAlpha) * bgRgb[2])
  ];
}

function getContrastRatio(rgb1, rgb2) {
  const L1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const L2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('=== EMPIRICAL WCAG AA CONTRAST AUDIT ===\n');

const testCases = [
  {
    name: '.btn-ivory (Normal State)',
    fgHex: '#1A1A1A',
    bgHex: '#F5F2ED',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.btn-ivory (Hover State)',
    fgHex: '#FFFFFF',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.sl, .sec-label (Overline text)',
    fgHex: '#C8C3BA',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.gold-grad (Gradient text clip - start)',
    fgHex: '#E5DFCD',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.gold-grad (Gradient text clip - end)',
    fgHex: '#C8C3BA',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.gold-italic',
    fgHex: '#E8D6B4',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.btn-gold-out / .bo (Outline button normal)',
    fgHex: '#F5EEF0',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: '.btn-gold-out / .bo (Outline button hover)',
    fgHex: '#FFFFFF',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: 'Category & Arrow Hover Text (.cat-card-explore, etc.)',
    fgHex: '#F5F2ED',
    bgHex: '#1A1A1A',
    minRatio: 4.5,
    scope: 'src/styles/luxe.css'
  },
  {
    name: 'SimplePage Card Body Text (App.tsx)',
    fgRgba: [26, 26, 26, 0.85],
    bgHex: '#FFFFFF',
    minRatio: 4.5,
    scope: 'src/App.tsx'
  },
  {
    name: 'Form Input Labels lbl (App.tsx)',
    fgRgba: [245, 242, 237, 0.85],
    bgHex: '#141414',
    minRatio: 4.5,
    scope: 'src/App.tsx'
  },
  {
    name: 'Input Placeholder Text (App.tsx)',
    fgRgba: [245, 242, 237, 0.65],
    bgHex: '#141414',
    minRatio: 4.5,
    scope: 'src/App.tsx'
  },
  {
    name: 'Discount Strike Price (App.tsx)',
    fgRgba: [255, 255, 255, 0.75],
    bgHex: '#141414',
    minRatio: 4.5,
    scope: 'src/App.tsx'
  },
  {
    name: 'Footer Copy & Links (App.tsx)',
    fgRgba: [255, 255, 255, 0.75],
    bgHex: '#141414',
    minRatio: 4.5,
    scope: 'src/App.tsx'
  },
  {
    name: 'AdminPanel Form Label Component (AdminPanel.tsx)',
    fgHex: '#D0C8B8',
    bgHex: '#1E1E1C',
    minRatio: 4.5,
    scope: 'src/components/AdminPanel.tsx'
  },
  {
    name: 'AdminPanel Table Headers th (AdminPanel.tsx)',
    fgHex: '#E5DFCD',
    bgHex: '#1E1E1C',
    minRatio: 4.5,
    scope: 'src/components/AdminPanel.tsx'
  }
];

let passCount = 0;
let failCount = 0;

testCases.forEach(tc => {
  const bgRgb = parseHex(tc.bgHex);
  let fgRgb;
  if (tc.fgHex) {
    fgRgb = parseHex(tc.fgHex);
  } else if (tc.fgRgba) {
    const [r, g, b, a] = tc.fgRgba;
    fgRgb = blendRgba([r, g, b], a, bgRgb);
  }

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const passed = ratio >= tc.minRatio;

  if (passed) {
    passCount++;
    console.log(`[PASS] ${tc.name}`);
    console.log(`       Contrast Ratio: ${ratio.toFixed(2)}:1 (Min required: ${tc.minRatio}:1)`);
  } else {
    failCount++;
    console.log(`[FAIL] ${tc.name}`);
    console.log(`       Contrast Ratio: ${ratio.toFixed(2)}:1 (Min required: ${tc.minRatio}:1)`);
  }
});

console.log(`\n========================================`);
console.log(`Summary: ${passCount} Passed, ${failCount} Failed.`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
}
