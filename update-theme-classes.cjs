const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Safe replaces that maintain intent but support dark mode
      
      // backgrounds
      content = content.replace(/bg-white\/(\d+)/g, 'bg-card/$1');
      content = content.replace(/bg-white\b/g, 'bg-card');
      
      // borders
      content = content.replace(/border-white\/(\d+)/g, 'border-border/$1');
      content = content.replace(/border-white\b/g, 'border-border');

      // text white - might need care if it's explicitly white on colored background
      // content = content.replace(/text-white\b/g, 'text-primary-foreground'); 
      // let's just do it conditionally or leave it if it's on primary/raspberry
      // Wait, text-white is often on bg-primary or bg-gradient, so leaving it is fine!

      // rose colors
      content = content.replace(/text-rose-600\/(\d+)/g, 'text-primary/$1');
      content = content.replace(/text-rose-600/g, 'text-primary');
      content = content.replace(/bg-rose-50\/(\d+)/g, 'bg-accent/$1');
      content = content.replace(/bg-rose-50/g, 'bg-accent');
      content = content.replace(/border-rose-100/g, 'border-primary/20');
      
      // hovers
      content = content.replace(/hover:bg-white\/(\d+)/g, 'hover:bg-card/$1');
      content = content.replace(/hover:bg-white\b/g, 'hover:bg-card');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done');
