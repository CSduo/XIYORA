const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.join(__dirname, '../../src/App.tsx'), 'utf8');
const lines = appContent.split('\n');

let currentSection = '';
lines.forEach((line, i) => {
  if (line.includes('<section')) {
    currentSection = line.trim();
  }
  if (line.includes('h2') && line.includes('serif')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
    console.log(`        Context Section: ${currentSection}`);
  }
});
