import fs from 'fs';
import url from 'url';
import path from 'path';

const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
const targetPath = path.resolve(currentDir, 'src', 'data', 'products.js');

try {
  let content = fs.readFileSync(targetPath, 'utf8');
  content = content.replace(/\.jpeg/g, '.png');
  content = content.replace(/\.jpg/g, '.png');
  content = content.replace(/'\/images\/food wrapping paper\.png'/g, "'/images/food wrapping paper.jpeg'");
  fs.writeFileSync(targetPath, content);
  console.log('Successfully replaced .jpeg with .png in products.js');
} catch (error) {
  console.error('Error:', error);
}
