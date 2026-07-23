const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'kokonutui');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (content.includes('next/image')) {
    // Fix next/image imports
    content = content.replace(/import Image from "next\/image";/g, '');
    content = content.replace(/import Image from 'next\/image';/g, '');
    
    // Replace <Image /> tags with <img />
    content = content.replace(/<Image\b/g, '<img');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Fixed images in: ${file}`);
  }
});

console.log('Done fixing images!');
