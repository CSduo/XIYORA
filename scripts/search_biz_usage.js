import fs from 'fs';

const content = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx', 'utf8');
const lines = content.split('\n');

const uses = [];
lines.forEach((line, index) => {
  if (line.includes('BIZ.')) {
    uses.push(`Line ${index + 1}: ${line.trim()}`);
  }
});
console.log(`Found ${uses.length} uses of BIZ.`);
uses.slice(0, 50).forEach(u => console.log(u));
