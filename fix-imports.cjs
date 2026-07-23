const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'kokonutui');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Fix next/link imports -> react-router-dom
  content = content.replace(/import Link from "next\/link";/g, 'import { Link } from "react-router-dom";');
  content = content.replace(/import Link from 'next\/link';/g, "import { Link } from 'react-router-dom';");
  
  // Fix "use client"; directive (not needed in Vite)
  content = content.replace(/^"use client";;\s*\n/gm, '');
  content = content.replace(/^"use client";\s*\n/gm, '');
  
  // Fix Link usage: next/link uses <Link href=...> while react-router uses <Link to=...>
  // But the shadcn Link component uses href, so we need to replace href with to in Link components
  // Be careful not to replace href in regular <a> tags
  content = content.replace(/<Link\s+href=/g, '<Link to=');
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');
