import fs from 'fs';

const content = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 3630; i < 3660; i++) {
  if (lines[i]) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
