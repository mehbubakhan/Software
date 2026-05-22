import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function OrphanageDirectory() {
  const [orphanages, setOrphanages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        const response = await api.get('/adoption/orphanages');
        setOrphanages(response.data.data || []);
      } catch (err) {
        console.error('Error fetching orphanages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrphanages();
  }, []);

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Licensed Orphanages</h1>
          <p className="text-slate-400">All facilities are verified, licensed, and regularly inspected for child safety and care standards.</p>
        </div>

        {/* Orphanages List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-slate-400 py-12">Loading orphanages...</div>
          ) : (
            orphanages.map(orphanage => (
              <div key={orphanage.id} className="bg-[#1a1c2d] border border-slate-700 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-fuchsia-500 transition group">
                
                {/* Image Placeholder */}
                <div className="md:w-1/3 bg-gradient-to-tr from-slate-800 to-slate-700 flex flex-wrap items-center justify-center p-4 relative min-h-[200px]">
                  <div className="grid grid-cols-4 gap-1 absolute inset-0 opacity-40">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="bg-slate-600 rounded-full w-4 h-4 m-auto"></div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{orphanage.name} <span className="text-yellow-400 text-lg">★ {orphanage.rating}</span></h3>
                      <p className="text-slate-400 text-sm">📍 {orphanage.address}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {orphanage.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{orphanage.childrenAdopted}</div>
                      <div className="text-xs text-slate-500">Children Adopted</div>
                    </div>
                    <div className="text-center border-x border-slate-700">
                      <div className="text-2xl font-bold text-white">{orphanage.established}</div>
                      <div className="text-xs text-slate-500">Established</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mt-1">{orphanage.license}</div>
                      <div className="text-xs text-slate-500">License</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-slate-400 mb-2 font-bold">Facilities:</div>
                    <div className="flex flex-wrap gap-2">
                      {orphanage.facilities.map((facility, idx) => (
                        <span key={idx} className="bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-800/50 text-xs px-2 py-1 rounded-md">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-slate-400 space-y-1 mb-6">
                    <p>📞 {orphanage.contact.phone}</p>
                    <p>✉️ {orphanage.contact.email}</p>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <button 
                      onClick={() => navigate(`${orphanage.id}`)}
                      className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 rounded-xl transition shadow-lg"
                    >
                      View Children
                    </button>
                    <button className="flex-1 bg-transparent hover:bg-slate-800 border border-slate-600 text-white font-semibold py-3 rounded-xl transition">
                      Schedule Visit
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 flex gap-4 items-start">
          <div className="text-fuchsia-400 text-2xl">🏢</div>
          <div>
            <h4 className="font-bold text-white mb-2">About Our Partner Orphanages</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              All orphanages listed on our platform are licensed by the Department of Social Welfare and undergo regular inspections to ensure the highest standards of child care. They provide 24/7 medical support, educational programs, and emotional care for all children.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
