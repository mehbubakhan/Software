const fs = require('fs');
const path = require('path');
const dir = 'backend/controllers';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let code = fs.readFileSync(filePath, 'utf8');

  // We want to replace `err ? err.message : "Internal error"` with `(typeof err !== 'undefined' ? err.message : (typeof error !== 'undefined' ? error.message : "Internal error"))`
  code = code.replace(/err \? err\.message : "Internal error"/g, "(typeof err !== 'undefined' ? err.message : (typeof error !== 'undefined' ? error.message : 'Internal error'))");

  fs.writeFileSync(filePath, code);
});
console.log('Fixed error variable references in controllers.');
