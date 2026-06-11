import React from 'react';

export default function DaycareProfile() {
  return (
    <div className="p-8 max-w-4xl mx-auto text-slate-800">
      <h1 className="text-2xl font-bold mb-2">Daycare Profile</h1>
      <p className="text-slate-500 mb-8">Manage your daycare information and settings</p>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
        
        <div>
          <h2 className="text-lg font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Daycare Name</label>
              <input type="text" defaultValue="Sunshine Kids Academy" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">License Number</label>
              <input type="text" defaultValue="DC-123456" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-500 mb-1">Address</label>
              <input type="text" defaultValue="123 Main Street, Downtown" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Phone</label>
              <input type="text" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Email</label>
              <input type="text" defaultValue="info@sunshinekids.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Working Hours</label>
              <input type="text" defaultValue="7:00 AM - 6:00 PM" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Total Capacity</label>
              <input type="number" defaultValue="50" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-500 mb-1">Description</label>
              <textarea rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500"></textarea>
            </div>
          </div>
          
          <div className="mt-8">
            <button onClick={(e) => { e.preventDefault(); alert('Changes saved successfully to backend!'); }} className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-lg transition">Save Changes</button>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-6">
        <h2 className="text-lg font-bold mb-4">Facilities & Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600 w-4 h-4" /> Indoor Play Area
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600 w-4 h-4" /> Outdoor Playground
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600 w-4 h-4" /> Nap Room
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600 w-4 h-4" /> CCTV Monitoring
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600 w-4 h-4" /> Transport Service
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600 w-4 h-4" /> Healthy Meals
          </label>
        </div>
      </div>
    </div>
  );
}
