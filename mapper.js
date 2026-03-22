import fs from 'fs';
const content = fs.readFileSync('src/data/products.js', 'utf8');
const lines = content.split('\n');
let currentName = '';
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('name:')) currentName = lines[i].trim();
  if (lines[i].includes('image:')) console.log(`${i+1}: ${currentName} -> ${lines[i].trim()}`);
}
