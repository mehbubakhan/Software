const fs = require('fs');
const path = require('path');
const mockFilePath = path.join(__dirname, 'mockProfiles.json');
try {
  fs.writeFileSync(mockFilePath, JSON.stringify({ "900": { "name": "Test" } }, null, 2));
  console.log("Write success. Exists:", fs.existsSync(mockFilePath));
} catch (e) {
  console.error("Write error:", e);
}
