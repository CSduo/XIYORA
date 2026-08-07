import fs from 'fs';
import path from 'path';

console.log('=== AST / SOURCE SCANNER FOR RESIDUAL CONTRAST ISSUES ===\n');

const filesToScan = [
  'src/styles/luxe.css',
  'src/App.tsx',
  'src/components/AdminPanel.tsx'
];

// Patterns that previously caused invisible or low-contrast text
const badPatterns = [
  { pattern: /color:\s*rgba\(0,\s*0,\s*0,\s*0\.(?:35|4|5|45)\)/g, desc: 'Dark low-alpha text override in luxe.css' },
  { pattern: /color:\s*rgba\(26,\s*26,\s*26,\s*0\.(?:35|4|5|45)\)/g, desc: 'Dark low-alpha text override in luxe.css' },
  { pattern: /color:\s*["']#f5f2ed["']/g, context: /background:\s*C\.white/g, desc: 'White text on white background' },
  { pattern: /color:\s*["']#666["']/g, desc: 'Low-contrast #666 text on dark modal/footer' },
  { pattern: /color:\s*["']#888["']/g, desc: 'Low-contrast #888 text in AdminPanel' },
  { pattern: /color:\s*["']#aaa["']/g, desc: 'Low-contrast #aaa text in AdminPanel' },
  { pattern: /rgba\(245,\s*242,\s*237,\s*\.3\)/g, desc: 'Low-opacity placeholder text .3' }
];

let totalIssues = 0;

filesToScan.forEach(filePath => {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const lines = content.split('\n');

  badPatterns.forEach(({ pattern, desc }) => {
    lines.forEach((line, index) => {
      // Exclude comments or valid non-text uses (e.g. borders, shadows) if any
      if (pattern.test(line)) {
        // Double check if line is actually setting text color
        if (line.includes('border:') || line.includes('box-shadow:') || line.includes('//')) {
          return;
        }
        console.log(`[WARNING/ISSUE] ${filePath}:${index + 1} -> ${desc}`);
        console.log(`                Line: ${line.trim()}`);
        totalIssues++;
      }
    });
  });
});

console.log(`\nScan finished with ${totalIssues} suspicious residual issues.`);
