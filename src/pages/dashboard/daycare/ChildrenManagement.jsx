import React from 'react';

export default function ChildrenManagement() {
  const children = [
    { id: 1, name: 'Emma Johnson', age: '3 years', program: 'Full-Time Monthly', parent: 'Sarah Johnson', image: '👧' },
    { id: 2, name: 'Oliver Brown', age: '4 years', program: 'Part-Time Weekly', parent: 'Michael Brown', image: '👦' },
    { id: 3, name: 'Sophia Lee', age: '2 years', program: 'Hourly Care', parent: 'Jessica Lee', image: '👧' },
    { id: 4, name: 'Liam Smith', age: '5 years', program: 'Full-Time Monthly', parent: 'David Smith', image: '👦' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Children Management</h1>
          <p className="text-slate-500">View and manage enrolled children</p>
        </div>
        <div className="flex gap-4">
          <input type="text" placeholder="Search by name..." className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500 w-full md:w-64" />
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition flex items-center gap-2">
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {children.map(child => (
          <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center text-3xl shrink-0">
              {child.image}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{child.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{child.age} • {child.program}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span>
              </div>
              <div className="text-sm text-slate-600 space-y-1 mb-4">
                <p><span className="text-slate-400">Parent:</span> {child.parent}</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 rounded-lg text-sm font-bold transition">View Profile</button>
                <button className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition">Message Parent</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
