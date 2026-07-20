const fs = require('fs');
const path = require('path');

const srcCssPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\scratch\\XIYORA\\artifacts\\xiyora\\src\\styles\\luxe.css';
console.log('srcCssPath exists:', fs.existsSync(srcCssPath));

if (fs.existsSync(srcCssPath)) {
  const content = fs.readFileSync(srcCssPath, 'utf-8');
  console.log('luxe.css length:', content.length);
  console.log('Contains pc-luxe:', content.includes('pc-luxe'));
  console.log('Contains pc-luxe:hover:', content.includes('pc-luxe:hover'));
  console.log('Contains border-radius: 4px:', content.includes('border-radius: 4px'));
  console.log('Contains tilt-card:', content.includes('tilt-card'));
  console.log('Contains .tilt-card:', content.includes('.tilt-card'));
}
