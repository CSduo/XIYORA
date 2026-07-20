const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  for (const [search, replace] of replacements) {
    const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    content = content.replace(new RegExp(escaped, 'g'), replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

const rootDir = __dirname;

// 1. App.tsx replacements
const appPath = path.join(rootDir, 'artifacts', 'xiyora', 'src', 'App.tsx');
const appReplacements = [
  ['%23C8A97E', '%23B87B5A'],
  ["'Playfair Display',serif", "'Libre Baskerville', serif"],
  ["'Playfair Display', serif", "'Libre Baskerville', serif"],
  ['"Playfair Display",serif', '"Libre Baskerville", serif'],
  ['"Playfair Display", serif', '"Libre Baskerville", serif'],
  ["'Inter',sans-serif", "'Space Grotesk', sans-serif"],
  ["'Inter', sans-serif", "'Space Grotesk', sans-serif"],
  ['"Inter",sans-serif', '"Space Grotesk", sans-serif'],
  ['"Inter", sans-serif', '"Space Grotesk", sans-serif'],
  ["'Playfair Display'", "'Libre Baskerville'"],
  ['"Playfair Display"', '"Libre Baskerville"'],
  ["'Inter'", "'Space Grotesk'"],
  ['"Inter"', '"Space Grotesk"']
];
replaceInFile(appPath, appReplacements);

// 2. AdminPanel.tsx replacements
const adminPath = path.join(rootDir, 'artifacts', 'xiyora', 'src', 'components', 'AdminPanel.tsx');
const adminReplacements = [
  ['const GOLD = "#C8A97E";', 'const GOLD = "#6BAE88";'],
  ['const GOLD = "#c8a97e";', 'const GOLD = "#6BAE88";'],
  ["'Playfair Display',serif", "'Libre Baskerville', serif"],
  ["'Playfair Display', serif", "'Libre Baskerville', serif"],
  ['"Playfair Display",serif', '"Libre Baskerville", serif'],
  ['"Playfair Display", serif', '"Libre Baskerville", serif'],
  ["'Inter',sans-serif", "'Space Grotesk', sans-serif"],
  ["'Inter', sans-serif", "'Space Grotesk', sans-serif"],
  ['"Inter",sans-serif', '"Space Grotesk", sans-serif'],
  ['"Inter", sans-serif', '"Space Grotesk", sans-serif'],
  ["'Playfair Display'", "'Libre Baskerville'"],
  ['"Playfair Display"', '"Libre Baskerville"'],
  ["'Inter'", "'Space Grotesk'"],
  ['"Inter"', '"Space Grotesk"']
];
replaceInFile(adminPath, adminReplacements);

// 3. luxe.css replacements
const cssPath = path.join(rootDir, 'artifacts', 'xiyora', 'src', 'styles', 'luxe.css');
const oldTokens = ':root {\n  --xr-black:       #060408;\n  --xr-obsidian:    #0d0a10;\n  --xr-charcoal:    #16101a;\n  --xr-surface:     rgba(22,16,26,0.85);\n  --xr-rose:        #E8B4C0;\n  --xr-rose-muted:  #C4889A;\n  --xr-rose-deep:   #9A5A6E;\n  --xr-rose-glow:   rgba(232,180,192,0.18);\n  --xr-rose-border: rgba(232,180,192,0.12);\n  --xr-gold:        #D4A574;\n  --xr-gold-soft:   #C8A97E;\n  --xr-ivory:       #F5EEF0;\n  --xr-ivory-muted: rgba(245,238,240,0.62);\n}';
const newTokens = ':root {\n  --xr-black:       #07090E;\n  --xr-obsidian:    #07090E;\n  --xr-charcoal:    #14171E;\n  --xr-surface:     rgba(7,9,14,0.85);\n  --xr-rose:        #B87B5A;\n  --xr-rose-muted:  #6BAE88;\n  --xr-rose-deep:   #8B563B;\n  --xr-rose-glow:   rgba(184,123,90,0.18);\n  --xr-rose-border: rgba(184,123,90,0.12);\n  --xr-gold:        #6BAE88;\n  --xr-gold-soft:   #6BAE88;\n  --xr-ivory:       #EDE8DF;\n  --xr-ivory-muted: rgba(237,232,223,0.62);\n}';
const cssReplacements = [
  [oldTokens, newTokens],
  ["'Playfair Display', serif", "'Libre Baskerville', serif"],
  ["'Playfair Display',serif", "'Libre Baskerville', serif"],
  ['"Playfair Display", serif', '"Libre Baskerville", serif'],
  ['"Playfair Display",serif', '"Libre Baskerville", serif'],
  ["'Inter', sans-serif", "'Space Grotesk', sans-serif"],
  ["'Inter',sans-serif", "'Space Grotesk', sans-serif"],
  ['"Inter", sans-serif', '"Space Grotesk", sans-serif'],
  ['"Inter",sans-serif', '"Space Grotesk", sans-serif']
];
replaceInFile(cssPath, cssReplacements);

console.log('Replacements completed successfully.');
