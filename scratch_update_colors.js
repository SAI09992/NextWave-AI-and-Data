const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'app')
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Replace tailwind colors
      content = content.replace(/cyan-(\d+)/g, 'yellow-$1');
      content = content.replace(/blue-(\d+)/g, 'red-$1');
      content = content.replace(/emerald-(\d+)/g, 'orange-$1');
      
      // Replace rgba values for shadows
      content = content.replace(/rgba\(0,229,255,/g, 'rgba(255,215,0,');
      content = content.replace(/rgba\(0,229,255/g, 'rgba(255,215,0');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated colors in ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(dir => processDirectory(dir));

console.log('Global color update complete.');
