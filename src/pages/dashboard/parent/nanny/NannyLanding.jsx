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
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Banner section */}
      <div className="bg-white border border-slate-200 p-12 text-center rounded-2xl shadow-sm mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-fuchsia-600/5 to-fuchsia-600/10 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Find Your Perfect Nanny</h1>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Connect directly with quality, independent caregivers and verified nannies.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 px-6 py-2 rounded-lg font-semibold text-white transition">Get Started</button>
            <button className="bg-white hover:bg-slate-50 px-6 py-2 rounded-lg font-semibold text-slate-700 transition border border-slate-300">Learn More</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Services Selection */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">Nanny Services</h2>
          <p className="text-slate-500 text-center mb-8">Choose how you'd like to hire</p>
          
          <div className="flex justify-center w-full max-w-md mx-auto">

            {/* Individual Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition w-full text-slate-900">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Hire Individual Nannies</h3>
              <p className="text-slate-500 text-sm mb-6">Connect directly with independent caregivers</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-8 text-left w-full px-8">
                <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> Direct hiring</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> View detailed profiles</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> Read reviews & ratings</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> Schedule video interviews</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> Flexible pricing</li>
              </ul>
              <button 
                onClick={() => navigate('individuals')}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-lg transition mt-auto"
              >
                Browse Nannies
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar section */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-slate-500 mb-4">Connect with verified, experienced nannies for full-time, part-time, or hourly care</p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 w-full max-w-md">
              <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or location..." 
                className="w-full bg-white border border-slate-300 rounded-full py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 justify-center">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? 'bg-fuchsia-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">Featured Nannies</h2>
          <p className="text-slate-500 text-center mb-8">Trusted and verified caregivers ready to help</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center text-slate-500 py-12">Loading featured nannies...</div>
            ) : (
              featured.filter(nanny => {
                const matchesSearch = nanny.name.toLowerCase().includes(searchQuery.toLowerCase()) || nanny.location.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFilter = activeFilter === 'All' || (nanny.type && nanny.type.toLowerCase().includes(activeFilter.toLowerCase()));
                return matchesSearch && matchesFilter;
              }).map(nanny => (
                <div key={nanny.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition group cursor-pointer text-slate-900" onClick={() => navigate(`${nanny.id}`)}>
                  <div className="h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-6xl relative">
                    {nanny.photo}
                    {nanny.available && (
                      <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">Available</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{nanny.name}</h4>
                      <span className="text-2xl font-bold text-fuchsia-600">{nanny.rate}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">📍 {nanny.location}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-600 mb-4">
                      <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> {nanny.rating} <span className="text-xs text-slate-500">({nanny.reviews})</span></span>
                      <span className="flex items-center gap-1 text-xs">🕒 {nanny.experience}</span>
                    </div>
                    <button className="w-full bg-fuchsia-600 text-white hover:bg-fuchsia-700 py-2 rounded-lg font-semibold transition text-sm">
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
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              View All Nannies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

