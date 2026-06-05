const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/ryash/Projects/collab-hub-landing/src';

const replacements = [
  { regex: /bg-white dark:bg-zinc-\d{3}(?:\/\d+)?/g, replacement: 'bg-card' },
  { regex: /bg-zinc-50 dark:bg-zinc-\d{3}(?:\/\d+)?/g, replacement: 'bg-secondary/50' },
  { regex: /bg-zinc-100 dark:bg-zinc-\d{3}(?:\/\d+)?/g, replacement: 'bg-secondary' },
  { regex: /dark:border-white\/\d+/g, replacement: '' },
  { regex: /border-border\/50/g, replacement: 'border-border' },
  { regex: /text-zinc-\d{3} dark:text-zinc-\d{3}/g, replacement: 'text-muted-foreground' },
  { regex: /hover:bg-zinc-\d{2,3} dark:hover:bg-zinc-\d{3}(?:\/\d+)?/g, replacement: 'hover:bg-muted' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk(directory);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  // Clean up double spaces from empty replacements
  content = content.replace(/  +/g, ' ');
  // Clean up space before closing quote
  content = content.replace(/ "/g, '"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
