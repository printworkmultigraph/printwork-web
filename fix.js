const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'src', 'data', 'products.js');

try {
  let content = fs.readFileSync(targetPath, 'utf8');
  content = content.replace(/\.jpeg/g, '.png');
  content = content.replace(/\.jpg/g, '.png');
  content = content.replace(/food wrapping paper\.png/g, 'food wrapping paper.jpeg');
  fs.writeFileSync(targetPath, content);
  console.log('products.js image extensions updated successfully.');
} catch (error) {
  console.error('Error updating products.js:', error);
}
