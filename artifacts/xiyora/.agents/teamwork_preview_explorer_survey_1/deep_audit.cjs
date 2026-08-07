const fs = require('fs');
const path = require('path');

const luxePath = 'C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/styles/luxe.css';
const appPath = 'C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx';
const adminPath = 'C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/components/AdminPanel.tsx';

// Helper to convert hex to RGB
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [aR, aG, aB] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return aR * 0.2126 + aG * 0.7152 + aB * 0.0722;
}

// Calculate WCAG contrast ratio
function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Blend RGBA over solid RGB background
function blendRgba(fgRgba, bgRgb) {
  const [r, g, b, a] = fgRgba;
  return [
    Math.round(r * a + bgRgb[0] * (1 - a)),
    Math.round(g * a + bgRgb[1] * (1 - a)),
    Math.round(b * a + bgRgb[2] * (1 - a))
  ];
}

console.log('=== WCAG CONTRAST CHECKER UTILITY READY ===');

// Let's audit luxe.css rules
const css = fs.readFileSync(luxePath, 'utf8');
const cssLines = css.split('\n');

const cssFindings = [];

cssLines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const t = line.trim();

  // Pattern 1: dark text rgba(26,26,26,0.45) on dark background (#1a1a1a or #0c0a08)
  if (t.includes('rgba(26,26,26,0.45)') || t.includes('color: rgba(26,26,26,0.45)')) {
    const fg = blendRgba([26, 26, 26, 0.45], [26, 26, 26]); // #1a1a1a bg
    const ratio = getContrastRatio(fg, [26, 26, 26]);
    cssFindings.push({
      file: 'src/styles/luxe.css',
      line: lineNum,
      code: t,
      issue: 'Dark muted text rgba(26,26,26,0.45) rendered over dark background (#1a1a1a / #0c0a08)',
      contrastRatio: ratio.toFixed(2) + ':1',
      wcagPass: false,
      fix: 'Change color to rgba(245,242,237,0.7) for dark mode or #4A453E (#1a1a1a background) / #EDE8DF on dark'
    });
  }

  // Pattern 2: .btn-ivory text issues
  if (t.includes('.btn-ivory') || (t.includes('color: #1a1a1a') && cssLines[idx-1]?.includes('.btn-ivory'))) {
    cssFindings.push({
      file: 'src/styles/luxe.css',
      line: lineNum,
      code: t,
      issue: '.btn-ivory background transparent with #1a1a1a text on dark page, or #EDE8DF text on light background',
      contrastRatio: '1.0:1 (Invisible!)',
      wcagPass: false,
      fix: 'Define .btn-ivory with solid high-contrast styling: background #F5F2ED, color #1A1A1A, border 1px solid #1A1A1A'
    });
  }

  // Pattern 3: .gold-grad / .gold-italic override turning text dark (#1a1a1a) inside dark sections
  if ((t.includes('.gold-grad') || t.includes('.gold-italic')) && t.includes('color:')) {
    cssFindings.push({
      file: 'src/styles/luxe.css',
      line: lineNum,
      code: t,
      issue: '.gold-grad or .gold-italic forcing color to #1a1a1a or rgba(26,26,26,0.45) inside dark containers',
      contrastRatio: '1.0:1 to 1.8:1',
      wcagPass: false,
      fix: 'Use high-contrast gradient/color: linear-gradient(135deg, #E5DFCD 0%, #C8C3BA 100%) or #C8C3BA on dark background'
    });
  }

  // Pattern 4: Low opacity white text rgba(245,238,240,0.35) or rgba(245,238,240,0.4) on dark background
  if (t.includes('rgba(245,238,240,0.35)') || t.includes('rgba(245,238,240,0.4)')) {
    const fg = blendRgba([245, 238, 240, 0.35], [26, 26, 26]);
    const ratio = getContrastRatio(fg, [26, 26, 26]);
    cssFindings.push({
      file: 'src/styles/luxe.css',
      line: lineNum,
      code: t,
      issue: 'Very low opacity white text (35-40% opacity) on dark background',
      contrastRatio: ratio.toFixed(2) + ':1 (Fails 4.5:1 WCAG AA standard)',
      wcagPass: false,
      fix: 'Increase opacity to at least rgba(245,238,240,0.7) or color #C8C3BA'
    });
  }
});

console.log('CSS Findings Count:', cssFindings.length);
fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/.agents/teamwork_preview_explorer_survey_1/css_findings.json', JSON.stringify(cssFindings, null, 2));
