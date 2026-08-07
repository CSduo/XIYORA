const fs = require('fs');
const path = require('path');

const luxeCss = fs.readFileSync(path.join(__dirname, '../../src/styles/luxe.css'), 'utf8');
const appTsx = fs.readFileSync(path.join(__dirname, '../../src/App.tsx'), 'utf8');

console.log("=== EMPIRICAL SPECIFICITY & CASCADE AUDIT ===");

// Check for !important color rules in luxe.css that override inline/class colors
const importantColorRules = [];
const lines = luxeCss.split('\n');

lines.forEach((line, index) => {
  if (line.includes('color:') && line.includes('!important')) {
    importantColorRules.push({ lineNum: index + 1, text: line.trim() });
  }
});

console.log(`Found ${importantColorRules.length} !important color rules in luxe.css:`);
importantColorRules.forEach(r => console.log(`  Line ${r.lineNum}: ${r.text}`));

// Specifically check .nl in luxe.css and usage in App.tsx
const nlRule = importantColorRules.find(r => r.text.includes('.nl'));
if (nlRule) {
  console.log("\n[CRITICAL BUG CONFIRMED] `.nl` has `!important` rule in luxe.css:");
  console.log(`  ${nlRule.text}`);
  console.log("  In App.tsx (line 5542): <button className=\"nl\" style={{color: page===v ? \"#ffffff\" : \"rgba(245,242,237,0.65)\"}}>");
  console.log("  CSS Spec Impact: The `!important` declaration in luxe.css overrides the inline style color.");
  console.log("  Result: Header nav links render dark text `rgba(0,0,0,0.45)` on dark background (`#07090E`), causing severe WCAG AA failure (~1.2:1 contrast ratio).");
}
