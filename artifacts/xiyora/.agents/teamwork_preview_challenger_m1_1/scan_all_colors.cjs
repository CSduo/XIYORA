const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../src');

const suspiciousPatterns = [
  { regex: /color\s*:\s*["']?#666["']?/i, desc: "Low-contrast hex #666 on dark bg" },
  { regex: /color\s*:\s*["']?#888["']?/i, desc: "Low-contrast hex #888 on dark bg" },
  { regex: /color\s*:\s*["']?#aaa["']?/i, desc: "Low-contrast hex #aaa on dark bg" },
  { regex: /color\s*:\s*rgba\(0,\s*0,\s*0,\s*0\.\d+\)/i, desc: "Semi-transparent black text override" },
  { regex: /color\s*:\s*rgba\(245,\s*242,\s*237,\s*0\.[0-3]\d*\)/i, desc: "Very low opacity light text (<0.4 opacity)" },
  { regex: /color\s*:\s*rgba\(255,\s*255,\s*255,\s*0\.[0-3]\d*\)/i, desc: "Very low opacity white text (<0.4 opacity)" },
  { regex: /#EDE8DF.*#d4d0cb|#d4d0cb.*#EDE8DF/i, desc: "Invisible text #EDE8DF on #d4d0cb bg" },
];

console.log("=== CODEBASE LOW-CONTRAST ANTI-PATTERN SCANNER ===");

let findingsCount = 0;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(tsx?|css|html)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        suspiciousPatterns.forEach(p => {
          if (p.regex.test(line)) {
            // Filter out comments or false positives if needed
            if (!line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
              console.log(`[WARNING] ${path.relative(srcDir, fullPath)}:${idx + 1} -> ${p.desc}`);
              console.log(`          Line: ${line.trim().substring(0, 100)}`);
              findingsCount++;
            }
          }
        });
      });
    }
  });
}

scanDir(srcDir);

console.log(`\nScan Complete. Total low-contrast anti-patterns found: ${findingsCount}`);
if (findingsCount > 0) {
  process.exit(1);
} else {
  console.log("SUCCESS: 0 low-contrast anti-patterns found across src/");
}
