import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../../services/api'

export default function AgencyNannies() {
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await api.get('/nanny/agencies')
        setAgencies(response.data.data || [])
      } catch (err) {
        console.error('Error fetching nanny agencies:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgencies()
  }, [])

  return (
    <div className="bg-[#111322] min-h-screen text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard/parent/hire-nanny')} className="text-slate-400 hover:text-white transition text-xl">
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Nanny Agencies</h1>
            <p className="text-slate-400">Browse verified agencies and find the perfect nanny for your family</p>
          </div>
        </div>

        {/* Search Bar section */}
        <div className="mb-10 flex gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              className="w-full bg-[#1a1c2d] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="bg-[#1a1c2d] border border-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition">
            <span>⚡</span> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center text-slate-400 py-12">Loading agencies...</div>
          ) : (
            agencies.map(agency => (
              <div key={agency.id} className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 hover:border-indigo-500 transition flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl shrink-0">
                    {agency.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{agency.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{agency.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold">{agency.rating}</span>
                  <span className="text-slate-400">({agency.reviews} reviews)</span>
                </div>

                <div className="space-y-2 text-sm text-slate-300 mb-6 flex-1">
                  <p className="flex items-center gap-2">📍 <span className="text-slate-400">{agency.location}</span></p>
                  <p className="flex items-center gap-2">👥 <span className="text-slate-400">{agency.numNannies} Nannies</span></p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {agency.skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition mt-auto"
                >
                  View Nannies
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
