import fs from 'fs';

const content = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/scratch/XIYORA/artifacts/xiyora/src/App.tsx', 'utf8');
const lines = content.split('\n');

const names = ['AboutView', 'SupplierView', 'ReviewsView', 'SimplePage', 'ProductDetail', 'LatexGuideView', 'CatalogView', 'CheckoutView', 'OrderStatusView'];
names.forEach(name => {
  lines.forEach((line, index) => {
    if (line.includes(`function ${name}`) || line.includes(`const ${name}`)) {
      console.log(`${name}: Line ${index + 1} -> ${line.trim()}`);
    }
  });
});
