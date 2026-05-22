import React from 'react';

export default function TransportManagement() {
  const vans = [
    { id: 1, number: 'Van #101', driver: 'Mark Johnson', phone: '555-0101', status: 'In Transit', route: 'North Zone' },
    { id: 2, number: 'Van #102', driver: 'Steve Davis', phone: '555-0102', status: 'Idle', route: 'South Zone' },
    { id: 3, number: 'Van #103', driver: 'Alan Smith', phone: '555-0103', status: 'In Transit', route: 'East Zone' },
    { id: 4, number: 'Van #104', driver: 'John Doe', phone: '555-0104', status: 'Maintenance', route: 'West Zone' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Transport Management</h1>
          <p className="text-slate-500">Manage drivers, GPS vans, and routes</p>
        </div>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center gap-2">
          <span>+</span> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {vans.map(van => (
          <div key={van.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                  🚐
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{van.number}</h3>
                  <p className="text-xs text-slate-500 font-medium">Route: {van.route}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                van.status === 'In Transit' ? 'bg-green-100 text-green-700' : 
                van.status === 'Idle' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
              }`}>
                {van.status}
              </span>
            </div>
            
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Driver:</span>
                <span className="font-medium text-slate-800">{van.driver}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium text-slate-800">{van.phone}</span>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2">
                📍 Live Track
              </button>
              <button className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition">
                Message Driver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
