const fs = require('fs');
const path = require('path');
const dir = 'backend/controllers';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let code = fs.readFileSync(filePath, 'utf8');

  code = code.replace(/res\.json\(\{\s*ok:\s*true,\s*id:\s*999,\s*mock:\s*true\s*\}\);/g, 'res.status(500).json({ ok: false, error: err ? err.message : "Internal error" });');
  code = code.replace(/res\.json\(\{\s*ok:\s*true,\s*mock:\s*true\s*\}\);/g, 'res.status(500).json({ ok: false, error: err ? err.message : "Internal error" });');
  code = code.replace(/res\.json\(\{\s*ok:\s*true,\s*data:\s*\[\],\s*mock:\s*true\s*\}\)/g, 'res.status(500).json({ ok: false, error: err ? err.message : "Internal error" })');
  
  code = code.replace(/res\.json\(\{\s*success:\s*true,\s*message:\s*'[^']+\(mock\)',\s*id:[^\}]+\}\)/g, 'res.status(500).json({ success: false, error: err ? err.message : "Internal error" })');
  code = code.replace(/res\.json\(\{\s*success:\s*true,\s*message:\s*'[^']+\(mock\)'\s*\}\)/g, 'res.status(500).json({ success: false, error: err ? err.message : "Internal error" })');
  code = code.replace(/res\.json\(\{\s*mock:\s*true,\s*data:\s*\[\]\s*\}\)/g, 'res.status(500).json({ success: false, error: err ? err.message : "Internal error" })');
  code = code.replace(/res\.json\(\{\s*ok:\s*false,\s*error:\s*err\.message,\s*mock:\s*true\s*\}\);/g, 'res.status(500).json({ ok: false, error: err ? err.message : "Internal error" });');

  fs.writeFileSync(filePath, code);
});
console.log('Refactored controllers successfully.');
