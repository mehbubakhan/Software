import React from 'react';

export default function StaffManagement() {
  const staff = [
    { id: 1, name: 'Ms. Sarah Williams', role: 'Lead Teacher', experience: '5 Years', cert: 'CPR Certified', image: '👩‍🏫' },
    { id: 2, name: 'Mr. David Chen', role: 'Teacher', experience: '3 Years', cert: 'First Aid', image: '👨‍🏫' },
    { id: 3, name: 'Ms. Emily Taylor', role: 'Assistant Teacher', experience: '2 Years', cert: 'Child Development', image: '👩‍🏫' },
    { id: 4, name: 'Ms. Jessica Martinez', role: 'Music Instructor', experience: '4 Years', cert: 'Music Ed', image: '👩‍🎤' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Staff Management</h1>
          <p className="text-slate-500">Manage teachers and daycare workers</p>
        </div>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center gap-2">
          <span>+</span> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map(person => (
          <div key={person.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-6 hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl shrink-0">
              {person.image}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{person.name} <span className="px-2 py-0.5 ml-2 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span></h3>
                  <p className="text-sm text-purple-600 font-medium mb-1">{person.role}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <p>Experience: {person.experience}</p>
                <p>Certification: {person.cert}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="p-2 text-slate-400 hover:text-purple-600 transition bg-slate-50 hover:bg-purple-50 rounded-lg">✏️</button>
              <button className="p-2 text-slate-400 hover:text-red-600 transition bg-slate-50 hover:bg-red-50 rounded-lg">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
