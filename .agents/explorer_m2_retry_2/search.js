const fs = require('fs');
const path = require('path');

const workspaceRoot = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\scratch\\XIYORA';
const appPath = path.join(workspaceRoot, 'artifacts', 'xiyora', 'src', 'App.tsx');
const cssPath = path.join(workspaceRoot, 'artifacts', 'xiyora', 'src', 'styles', 'luxe.css');

const appContent = fs.readFileSync(appPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

function findPatterns(filename, content, patterns) {
  console.log(`=== Matches in ${filename} ===`);
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    patterns.forEach(pattern => {
      let matched = false;
      if (pattern instanceof RegExp) {
        matched = pattern.test(line);
      } else {
        matched = line.includes(pattern);
      }
      if (matched) {
        console.log(`Line ${idx + 1}: ${line.trim()} (matched: ${pattern.toString()})`);
      }
    });
  });
}

findPatterns('App.tsx', appContent, [
  'xiyora-cursor',
  'cursorX',
  'cursorY',
  'x-orb',
  'orbDrift',
  'hero-particle-canvas',
  'ParticleCanvas',
  'vanilla-tilt',
  'VanillaTilt',
  'tilt-card',
  'goldBorderPulse',
  'goldTextShimmer',
  'btnBorderAnim',
  'sweepBtn',
  'isOpen',
  'showDrawer',
  'mobileMenu',
  'isMenuOpen',
  'sdrawer',
  'object-cover',
  'object-contain',
  'hidden md:flex',
  'hidden lg:flex',
  'md:flex hidden',
  'lg:flex hidden'
]);

findPatterns('luxe.css', cssContent, [
  '.xiyora-cursor',
  '.xiyora-cursor-dot',
  'orbDrift',
  '.x-orb',
  'hero-particle-canvas',
  'goldBorderPulse',
  'goldTextShimmer',
  'btnBorderAnim',
  'sweepBtn',
  'box-shadow: 0 0 30px',
  'box-shadow: 0 0 32px',
  'box-shadow: 0 0 14px',
  'rgba(200,169,126,0.38)',
  'rgba(200,169,126,0.35)',
  'rgba(200,169,126,0.22)',
  'rgba(246, 239, 224, 0.08)',
  'x-gold-divider',
  'min-width',
  '22s',
  '34s',
  '.biz-grid',
  'grid-template-columns',
  '.stat-badge:hover',
  'translateY',
  '.sdrawer',
  '.pc-luxe'
]);
