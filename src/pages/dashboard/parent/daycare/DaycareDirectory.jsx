import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function DaycareDirectory() {
  const [daycares, setDaycares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDaycares = async () => {
      try {
        const response = await api.get('/daycare');
        setDaycares(response.data.data || []);
      } catch (err) {
        console.error('Error fetching daycares:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaycares();
  }, []);

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-6xl mx-auto mt-8">
        
        {/* Header Title */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Quality Daycare Centers</h1>
          <p className="text-slate-400">Discover safe, nurturing environments where your child can learn and grow.</p>
          <button 
            onClick={() => navigate('child/1')}
            className="absolute top-0 right-0 bg-[#1a1c2d] border border-slate-700 hover:border-fuchsia-500 text-white px-4 py-2 rounded-xl transition text-sm font-semibold flex items-center gap-2"
          >
            👧 My Enrolled Children
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                className="w-full bg-[#1a1c2d] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`bg-[#1a1c2d] border border-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition ${showFilters ? 'border-fuchsia-500 text-fuchsia-400' : ''}`}
            >
              <span>⚡</span> Filter
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-xl p-6 transition-all duration-300">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 text-center">Filter Options</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <select className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 outline-none focus:border-fuchsia-500 w-full md:w-auto min-w-[150px]">
                  <option>Transport Available</option>
                  <option>Self Drop-off</option>
                </select>
                <select className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 outline-none focus:border-fuchsia-500 w-full md:w-auto min-w-[150px]">
                  <option>Live CCTV</option>
                  <option>No CCTV</option>
                </select>
                <select className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 outline-none focus:border-fuchsia-500 w-full md:w-auto min-w-[150px]">
                  <option>Select Activity</option>
                  <option>Music & Arts</option>
                  <option>STEM Learning</option>
                  <option>Physical Ed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Daycares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {loading ? (
            <div className="col-span-3 text-center text-slate-400 py-12">Loading daycares...</div>
          ) : (
            daycares.map(daycare => (
              <div key={daycare.id} className="bg-[#1a1c2d] border border-slate-700 rounded-2xl overflow-hidden hover:border-fuchsia-500 transition group flex flex-col">
                {/* Card Header (Image/Banner Placeholder) */}
                <div className="h-48 bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 flex items-center justify-center text-6xl relative">
                  {daycare.image}
                  
                  {daycare.tags?.includes('Featured') && (
                    <span className="absolute top-4 left-4 bg-fuchsia-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">Featured</span>
                  )}
                  {daycare.tags?.includes('Verified') && (
                    <span className="absolute top-4 left-4 bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full font-bold">Verified</span>
                  )}
                  
                  <button className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-slate-300 hover:text-white hover:bg-black/60 transition">
                    ♡
                  </button>
                </div>
                
                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2">{daycare.name}</h3>
                  
                  <div className="flex gap-2 mb-3">
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">✓ Verified</span>
                    {daycare.tags?.includes('Live CCTV') && (
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">🔴 Live CCTV</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg leading-none">★</span>
                      <span className="font-bold text-white">{daycare.rating}</span>
                      <span className="text-slate-400">({daycare.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      📍 {daycare.location}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300 mb-6 flex-1">
                    <p className="flex items-center gap-2">🕒 <span className="text-slate-400">{daycare.hours}</span></p>
                    <p className="flex items-center gap-2">👥 <span className="text-slate-400">{daycare.childrenEnrolled}</span></p>
                    <p className="flex items-center gap-2">💲 <span className="text-fuchsia-400 font-semibold">{daycare.price}</span></p>
                    <p className="flex items-center gap-2">🚌 <span className="text-slate-400">{daycare.transportAvailable ? 'Transport Available' : 'Self Drop-off'}</span></p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => navigate(`${daycare.id}`)}
                      className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate(`${daycare.id}/apply`)}
                      className="flex-1 bg-transparent hover:bg-slate-800 border border-slate-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!loading && daycares.length > 0 && (
          <div className="text-center pb-12">
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-12 rounded-xl transition w-full max-w-md">
              See More
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
