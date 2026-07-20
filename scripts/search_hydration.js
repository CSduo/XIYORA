import fs from 'fs';

const content = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('catImg_LatexMaterial') && line.includes('??')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
    // print 5 lines before and 5 lines after
    for (let i = index - 15; i <= index + 50; i++) {
      if (lines[i] !== undefined) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  }
});
