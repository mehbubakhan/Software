const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\USER\\Documents\\GitHub\\Software\\src\\pages\\dashboard\\daycare\\new-design\\components';

function processFiles(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix implicit any on onChange
      content = content.replace(/onChange=\{v => /g, 'onChange={(v: any) => ');
      content = content.replace(/onChange=\{e => /g, 'onChange={(e: any) => ');
      
      // Fix JSX.Element to React.ReactNode or React.JSX.Element
      // Actually JSX.Element can just be replaced with React.ReactNode
      content = content.replace(/JSX\.Element/g, 'React.ReactNode');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processFiles(dir);
console.log('Fixed typings!');
