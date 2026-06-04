const fs = require('fs');
const pages = ['ChildManagement', 'Applications', 'Meetings', 'Counselling', 'StaffManagement', 'Analytics', 'Messages', 'Reports', 'Settings'];

pages.forEach(p => {
  const code = `import React from 'react';

export default function ${p}() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">${p.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <p className="text-slate-500">This module is currently under construction.</p>
    </div>
  );
}
`;
  fs.writeFileSync(`src/pages/dashboard/orphanage/${p}.jsx`, code);
});
console.log('Done');
