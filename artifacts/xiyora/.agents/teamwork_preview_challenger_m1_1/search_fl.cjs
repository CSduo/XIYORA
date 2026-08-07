const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.join(__dirname, '../../src/App.tsx'), 'utf8');
const lines = appContent.split('\n');

lines.forEach((line, i) => {
  if (line.includes('fl') && (line.includes('className') || line.includes('class'))) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
});
