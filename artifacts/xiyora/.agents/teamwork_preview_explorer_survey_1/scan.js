const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src';

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relPath = path.relative(rootDir, filePath);

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    // Check for low contrast patterns
    // 1. rgba(26,26,26,0.45) or low opacity dark text
    if (line.includes('rgba(26,26,26,0.45)') || line.includes('rgba(26,26,26, .45)') || line.includes('rgba(26, 26, 26, 0.45)')) {
      console.log(`[LOW_CONTRAST_DARK_TEXT_ON_DARK] ${relPath}:${lineNum}: ${line.trim()}`);
    }
    // 2. .btn-ivory issues
    if (line.includes('btn-ivory') || line.includes('#EDE8DF') || line.includes('#d4d0cb')) {
      console.log(`[BTN_IVORY_PATTERN] ${relPath}:${lineNum}: ${line.trim()}`);
    }
    // 3. rgba(245,238,240,0.35) or low opacity light text (<0.5 opacity)
    if (line.match(/rgba\(\s*245\s*,\s*238\s*,\s*240\s*,\s*0\.[1234]\d?\)/) || line.match(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[1234]\d?\)/)) {
      console.log(`[LOW_OPACITY_LIGHT_TEXT] ${relPath}:${lineNum}: ${line.trim()}`);
    }
    // 4. Form labels / helper text / placeholders with low contrast (#888, #666, #aaa, rgba(0,0,0,0.35))
    if (line.match(/color:\s*(['"])?(#666|#888|#aaa|#999|rgba\(0,\s*0,\s*0,\s*0\.[234]\d?\))\1/i)) {
      console.log(`[LOW_CONTRAST_FORM_LABEL] ${relPath}:${lineNum}: ${line.trim()}`);
    }
    // 5. Hardcoded light text on light background or dark text on dark background in App.tsx / AdminPanel.tsx
    if (line.includes('gold-grad') || line.includes('gold-italic') || line.includes('sec-label') || line.includes('sl')) {
      if (line.includes('color:') || line.includes('.gold-grad') || line.includes('.sec-label')) {
        console.log(`[GRADIENT_OR_LABEL] ${relPath}:${lineNum}: ${line.trim()}`);
      }
    }
  });
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (f.endsWith('.css') || f.endsWith('.tsx') || f.endsWith('.ts')) {
      scanFile(fullPath);
    }
  }
}

walkDir(rootDir);
