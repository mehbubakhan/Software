import React, { useState, useEffect } from 'react'
import api from '../../../services/api'

export default function HireNanny() {
  const [nannies, setNannies] = useState([])
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    rating: '',
    salary: '',
  })
  const [selectedNanny, setSelectedNanny] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        const response = await api.get('/nanny/list')
        setNannies(response.data || [])
      } catch (error) {
        console.error('Error fetching nannies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNannies()
  }, [filters])

  const mockNannies = [
    {
      id: 1,
      name: 'Maria Garcia',
      photo: '👩',
      experience: '5 years',
      rating: 4.8,
      reviews: 24,
      location: 'Downtown',
      salary: '$600/week',
      skills: ['Infant care', 'Cooking', 'Educational activities'],
      verified: true,
      availability: 'Available Now'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      photo: '👩‍🦱',
      experience: '3 years',
      rating: 4.6,
      reviews: 18,
      location: 'Suburbs',
      salary: '$500/week',
      skills: ['Toddler care', 'First aid certified'],
      verified: true,
      availability: 'Available in 2 weeks'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      photo: '👩‍🦰',
      experience: '7 years',
      rating: 4.9,
      reviews: 32,
      location: 'Central',
      salary: '$700/week',
      skills: ['All ages', 'Bilingual', 'Special needs'],
      verified: true,
      availability: 'Available Now'
    }
  ]

  const displayNannies = loading ? [] : (nannies.length > 0 ? nannies : mockNannies)

  const handleHire = async (nanny) => {
    try {
      await api.post('/nanny/booking', {
        nannyId: nanny.id,
        status: 'pending'
      })
      alert('Hire request sent successfully!')
      setSelectedNanny(null)
    } catch (error) {
      console.error('Error sending hire request:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hire a Nanny</h1>
        <p className="text-slate-600 mt-2">Find and hire verified, experienced nannies</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
        <select
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          <option value="">Experience</option>
          <option value="1">1+ years</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
        </select>
        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          <option value="">Rating</option>
          <option value="4.5">4.5+ stars</option>
          <option value="4.7">4.7+ stars</option>
          <option value="4.9">4.9+ stars</option>
        </select>
        <select
          value={filters.salary}
          onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          <option value="">Salary Range</option>
          <option value="500">Up to $500/week</option>
          <option value="600">$500-$700/week</option>
          <option value="800">$700+/week</option>
        </select>
      </div>

      {/* Nanny Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayNannies.map((nanny) => (
          <div key={nanny.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{nanny.photo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{nanny.name}</h3>
                  {nanny.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Verified</span>}
                </div>
                <p className="text-sm text-slate-600">{nanny.location}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-semibold">{nanny.rating}</span>
                  <span className="text-xs text-slate-500">({nanny.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-sm text-slate-600"><span className="font-semibold">Experience:</span> {nanny.experience}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold">Salary:</span> {nanny.salary}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold">Availability:</span> {nanny.availability}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {nanny.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedNanny(nanny)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition"
              >
                View Profile
              </button>
              <button
                onClick={() => handleHire(nanny)}
                className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition"
              >
                Send Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedNanny && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">{selectedNanny.photo}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{selectedNanny.name}</h2>
                <p className="text-slate-600">{selectedNanny.location}</p>
              </div>
              <button
                onClick={() => setSelectedNanny(null)}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <p><span className="font-semibold">Experience:</span> {selectedNanny.experience}</p>
              <p><span className="font-semibold">Rating:</span> {selectedNanny.rating} ⭐</p>
              <p><span className="font-semibold">Salary:</span> {selectedNanny.salary}</p>
              <p><span className="font-semibold">Availability:</span> {selectedNanny.availability}</p>
              <div>
                <p className="font-semibold mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNanny.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleHire(selectedNanny)
              }}
              className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
            >
              Send Hire Request
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
