import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../../services/api'

export default function NannyLanding() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const filters = ['All', 'Full-time', 'Part-time', 'Live-in']
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/nanny/featured')
        setFeatured(response.data.data || [])
      } catch (err) {
        console.error('Error fetching featured nannies', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="bg-[#111322] min-h-screen text-slate-100 -m-6 p-6 font-sans">
      
      {/* Top Banner section */}
      <div className="bg-[#241a4a] -m-6 p-12 text-center rounded-b-3xl shadow-lg mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Find Your Perfect Nanny</h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
          Connect directly with quality, independent caregivers and verified nannies.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg font-semibold text-white transition">Get Started</button>
          <button className="bg-indigo-800 hover:bg-indigo-900 px-6 py-2 rounded-lg font-semibold text-white transition border border-indigo-500">Learn More</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Services Selection */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">Nanny Services</h2>
          <p className="text-slate-400 text-center mb-8">Choose how you'd like to hire</p>
          
          <div className="flex justify-center w-full max-w-md mx-auto">

            {/* Individual Card */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center hover:border-indigo-500 transition w-full">
              <div className="bg-slate-800 p-4 rounded-full text-2xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Hire Individual Nannies</h3>
              <p className="text-slate-400 text-sm mb-6">Connect directly with independent caregivers</p>
              <ul className="text-sm text-slate-300 space-y-2 mb-8 text-left w-full px-8">
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Direct hiring</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> View detailed profiles</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Read reviews & ratings</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Schedule video interviews</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Flexible pricing</li>
              </ul>
              <button 
                onClick={() => navigate('individuals')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition mt-auto"
              >
                Browse Nannies
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar section (mockup visual only for landing page) */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-slate-400 mb-4">Connect with verified, experienced nannies for full-time, part-time, or hourly care</p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 w-full max-w-md">
              <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or location..." 
                className="w-full bg-[#1a1c2d] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 justify-center">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-[#1a1c2d] border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Nannies */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">Featured Nannies</h2>
          <p className="text-slate-400 text-center mb-8">Trusted and verified caregivers ready to help</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center text-slate-400 py-12">Loading featured nannies...</div>
            ) : (
              featured.filter(nanny => {
                const matchesSearch = nanny.name.toLowerCase().includes(searchQuery.toLowerCase()) || nanny.location.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFilter = activeFilter === 'All' || (nanny.type && nanny.type.toLowerCase().includes(activeFilter.toLowerCase()));
                return matchesSearch && matchesFilter;
              }).map(nanny => (
                <div key={nanny.id} className="bg-[#1a1c2d] border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500 transition group cursor-pointer" onClick={() => navigate(`${nanny.id}`)}>
                  <div className="h-48 bg-slate-800 flex items-center justify-center text-6xl relative">
                    {nanny.photo}
                    {nanny.available && (
                      <span className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-semibold border border-green-500/30">Available</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{nanny.name}</h4>
                      <span className="text-sm font-semibold">{nanny.rate}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">📍 {nanny.location}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> {nanny.rating} ({nanny.reviews})</span>
                      <span className="flex items-center gap-1">🕒 {nanny.experience}</span>
                    </div>
                    <button className="w-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 py-2 rounded-lg font-semibold transition text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={() => navigate('individuals')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              View All Nannies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
