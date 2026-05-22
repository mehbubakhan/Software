import React from 'react';

export default function ProgramsAndPackages() {
  const packages = [
    { id: 1, type: 'Hourly Plan', age: 'Ages 6 mos - 5 years', price: '$15', duration: 'Hourly', features: ['Same-day booking', 'Play area access'] },
    { id: 2, type: 'Daily Plan', age: 'Ages 6 mos - 5 years', price: '$60', duration: 'Daily', features: ['Meals included', 'Nap time', 'Learning activities'] },
    { id: 3, type: 'Weekly Plan', age: 'Ages 6 mos - 5 years', price: '$250', duration: 'Weekly', features: ['All daily features', 'Progress report'] },
    { id: 4, type: 'Monthly Plan', age: 'Ages 6 mos - 5 years', price: '$900', duration: 'Monthly', features: ['All weekly features', 'Parent-teacher meeting'] }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Programs & Packages</h1>
          <p className="text-slate-500">Manage your daycare admission packages</p>
        </div>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center gap-2">
          <span>+</span> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold">{pkg.type}</h2>
                  <p className="text-xs text-slate-400 mt-1">{pkg.age}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-purple-600 transition">✏️</button>
                  <button className="text-slate-400 hover:text-red-600 transition">🗑️</button>
                </div>
              </div>
              
              <div className="text-4xl font-black text-purple-600 mb-6">
                {pkg.price}
                <span className="text-sm font-medium text-slate-400 ml-1">/{pkg.duration.toLowerCase()}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded">Active</span>
              <button className="text-sm text-purple-600 font-medium hover:underline">View details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
