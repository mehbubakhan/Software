import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function AdoptionDirectory() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await api.get('/adoption/children');
        setChildren(response.data.data || []);
      } catch (err) {
        console.error('Error fetching children:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Children Available for Adoption</h1>
          <p className="text-slate-500">Each child deserves a loving home. Browse profiles to learn about their personalities, interests, and needs.</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2">
            <span>⚡</span> Filter Children
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Age Group</label>
              <select className="w-full bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-fuchsia-500 text-sm">
                <option value="">Any Age</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6+">6+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Gender</label>
              <select className="w-full bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-fuchsia-500 text-sm">
                <option value="">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="block text-xs text-slate-500 mb-1">Results</label>
              <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-fuchsia-400 font-semibold text-center h-full flex items-center justify-center">
                {children.length} children found
              </div>
            </div>
          </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center text-slate-500 py-12">Loading profiles...</div>
          ) : (
            children.map(child => (
              <div key={child.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-fuchsia-500 transition group flex flex-col">
                
                {/* Profile Header */}
                <div className="p-6 flex flex-col items-center border-b border-slate-200">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-slate-800 text-4xl font-bold mb-4 shadow-lg">
                    {child.image}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{child.child_name}</h3>
                </div>

                {/* Profile Body */}
                <div className="p-6 flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-slate-800 text-lg">{child.age}</div>
                    <div className={`text-xs px-2 py-1 rounded font-semibold ${child.adoption_status === 'available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {child.adoption_status}
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 mb-4 space-y-1">
                    <div><span className="font-semibold text-slate-600">{child.gender}</span></div>
                    <div className="flex items-start gap-2">
                      <span>📍</span> <span>{child.orphanage_name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🕒</span> <span>Available since {child.created_at ? new Date(child.created_at).toLocaleDateString() : 'Recently'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                    {child.short_description || child.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-xs text-slate-500 mb-2">Interests:</div>
                    <div className="flex flex-wrap gap-2">
                      {String(child.interests || '').split(',').filter(Boolean).map((interest, idx) => (
                        <span key={idx} className="bg-slate-100 text-fuchsia-300 border border-slate-200 text-xs px-2 py-1 rounded-md">
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(`${child.id}`)}
                      className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
                    >
                      View Profile
                    </button>
                    <button className="bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 p-2.5 rounded-xl transition flex items-center justify-center">
                      ♡
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}


