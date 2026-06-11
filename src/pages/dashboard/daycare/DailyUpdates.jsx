import React, { useState } from 'react';

export default function DailyUpdates() {
  const [updates, setUpdates] = useState([
    { id: 1, child: 'Emma Johnson', type: 'Play Time', desc: 'Had a great time building blocks with friends!', time: '2 hours ago' },
    { id: 2, child: 'Oliver Brown', type: 'Meal', desc: 'Ate a healthy lunch - chicken and veggies.', time: '3 hours ago' },
    { id: 3, child: 'Sophia Lee', type: 'Nap', desc: 'Slept peacefully for 1.5 hours.', time: '4 hours ago' }
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Daily Updates</h1>
          <p className="text-slate-500">Provide daily updates to parents</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <h2 className="text-lg font-bold mb-6">Create Daily Update</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-slate-500 mb-1">Select Child</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500 bg-white">
              <option>Emma Johnson</option>
              <option>Oliver Brown</option>
              <option>Sophia Lee</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-500 mb-1">Update Type</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500 bg-white">
              <option>Meal</option>
              <option>Nap</option>
              <option>Play Time</option>
              <option>Learning Activity</option>
              <option>General</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-500 mb-1">Details</label>
            <textarea rows="3" placeholder="Describe the activity..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-fuchsia-500"></textarea>
          </div>
          
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition cursor-pointer">
            <p className="text-sm text-slate-500">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
          
          <button className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-lg transition">
            Post Update
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Recent Updates</h2>
        <div className="space-y-4">
          {updates.map(update => (
            <div key={update.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex justify-between items-start hover:border-fuchsia-200 transition">
              <div>
                <h3 className="font-bold text-slate-800">{update.child} - {update.type}</h3>
                <p className="text-sm text-slate-600 mt-1">{update.desc}</p>
              </div>
              <span className="text-xs text-slate-400">{update.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
