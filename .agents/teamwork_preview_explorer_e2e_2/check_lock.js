import fs from 'node:fs';
import path from 'node:path';

const lockPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\scratch\\XIYORA\\pnpm-lock.yaml';
try {
  const content = fs.readFileSync(lockPath, 'utf8');
  const packages = ['jsdom', 'playwright', 'postcss', 'happy-dom', 'vitest', 'jest', 'puppeteer', 'cheerio', 'htmlparser2'];
  console.log('Searching pnpm-lock.yaml for packages...');
  for (const pkg of packages) {
    const regex = new RegExp(`[/@]${pkg}[/@\\s]`, 'i');
    const found = content.match(regex);
    console.log(`- ${pkg}: ${found ? 'FOUND (' + found[0] + ')' : 'NOT FOUND'}`);
  }
} catch (err) {
  console.error('Error reading lock file:', err);
}
