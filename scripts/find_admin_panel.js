import fs from 'fs';

const content = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('function AdminPanel') || line.includes('const AdminPanel')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
