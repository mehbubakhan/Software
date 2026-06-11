import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function DaycareDirectory() {
  const [daycares, setDaycares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transportFilter, setTransportFilter] = useState('All');
  const [cctvFilter, setCctvFilter] = useState('All');
  const [activityFilter, setActivityFilter] = useState('All');
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
    <div className="space-y-6 pb-12 font-sans">
      <div className="max-w-6xl mx-auto mt-8">
        
        {/* Header Title */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Find Your Quality Daycare Centers</h1>
          <p className="text-slate-500">Discover safe, nurturing environments where your child can learn and grow.</p>
          <button 
            onClick={() => navigate('child/1')}
            className="absolute top-0 right-0 bg-white border border-slate-200 hover:border-fuchsia-500 text-slate-700 hover:text-fuchsia-600 px-4 py-2 rounded-xl transition text-sm font-semibold flex items-center gap-2 shadow-sm"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or location..." 
                className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500 shadow-sm transition"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`bg-white border border-slate-300 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-50 shadow-sm transition font-semibold text-slate-700 ${showFilters ? 'border-fuchsia-500 text-fuchsia-600 bg-fuchsia-50' : ''}`}
            >
              <span>⚡</span> Filter
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 transition-all duration-300">
              <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">Filter Options</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <select 
                  value={transportFilter}
                  onChange={(e) => setTransportFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2 outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 w-full md:w-auto min-w-[150px]"
                >
                  <option value="All">Any Transport</option>
                  <option value="Transport Available">Transport Available</option>
                  <option value="Self Drop-off">Self Drop-off</option>
                </select>
                <select 
                  value={cctvFilter}
                  onChange={(e) => setCctvFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2 outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 w-full md:w-auto min-w-[150px]"
                >
                  <option value="All">Any CCTV Option</option>
                  <option value="Live CCTV">Live CCTV</option>
                  <option value="No CCTV">No CCTV</option>
                </select>
                <select 
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2 outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 w-full md:w-auto min-w-[150px]"
                >
                  <option value="All">Any Activity</option>
                  <option value="Music & Arts">Music & Arts</option>
                  <option value="STEM Learning">STEM Learning</option>
                  <option value="Physical Ed">Physical Ed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Daycares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {loading ? (
            <div className="col-span-3 text-center text-slate-500 py-12">Loading daycares...</div>
          ) : (
            daycares.filter(daycare => {
              const query = searchQuery.toLowerCase().trim();
              const matchesSearch = !query || 
                                    (daycare.name && daycare.name.toLowerCase().includes(query)) || 
                                    (daycare.location && daycare.location.toLowerCase().includes(query));
              
              let matchesTransport = true;
              if (transportFilter === 'Transport Available') matchesTransport = !!daycare.transportAvailable;
              if (transportFilter === 'Self Drop-off') matchesTransport = !daycare.transportAvailable;

              let matchesCctv = true;
              if (cctvFilter === 'Live CCTV') matchesCctv = !!daycare.tags?.includes('Live CCTV');
              if (cctvFilter === 'No CCTV') matchesCctv = !daycare.tags?.includes('Live CCTV');

              let matchesActivity = true;
              if (activityFilter !== 'All') {
                if (activityFilter === 'Music & Arts') matchesActivity = [1, 2].includes(daycare.id);
                else if (activityFilter === 'STEM Learning') matchesActivity = [2, 4].includes(daycare.id);
                else if (activityFilter === 'Physical Ed') matchesActivity = [1, 3, 4].includes(daycare.id);
              }

              return matchesSearch && matchesTransport && matchesCctv && matchesActivity;
            }).map(daycare => (
              <div key={daycare.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition group flex flex-col text-slate-900 cursor-pointer" onClick={() => navigate(`${daycare.id}`)}>
                {/* Card Header (Image/Banner Placeholder) */}
                <div className="h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-6xl relative">
                  {daycare.image}
                  
                  {daycare.tags?.includes('Featured') && (
                    <span className="absolute top-4 left-4 bg-fuchsia-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">Featured</span>
                  )}
                  {daycare.tags?.includes('Verified') && (
                    <span className="absolute top-4 left-4 bg-green-100 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full font-bold">Verified</span>
                  )}
                  
                  <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition shadow-sm" onClick={(e) => { e.stopPropagation(); /* handle favorite */ }}>
                    ♡
                  </button>
                </div>
                
                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{daycare.name}</h3>
                  
                  <div className="flex gap-2 mb-3">
                    <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">✓ Verified</span>
                    {daycare.tags?.includes('Live CCTV') && (
                      <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">🔴 Live CCTV</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg leading-none">★</span>
                      <span className="font-bold text-slate-900">{daycare.rating}</span>
                      <span className="text-slate-500">({daycare.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      📍 {daycare.location}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 mb-6 flex-1">
                    <p className="flex items-center gap-2">🕒 <span className="text-slate-500">{daycare.hours}</span></p>
                    <p className="flex items-center gap-2">👥 <span className="text-slate-500">{daycare.childrenEnrolled}</span></p>
                    <p className="flex items-center gap-2">💲 <span className="text-fuchsia-600 font-bold">{daycare.price}</span></p>
                    <p className="flex items-center gap-2">🚌 <span className="text-slate-500">{daycare.transportAvailable ? 'Transport Available' : 'Self Drop-off'}</span></p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${daycare.id}`)
                      }}
                      className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${daycare.id}/apply`)
                      }}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
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
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-12 rounded-xl transition shadow-sm w-full max-w-md">
              See More
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

