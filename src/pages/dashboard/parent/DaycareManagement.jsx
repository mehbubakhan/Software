import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'

export default function DaycareManagement() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('browse')
  const [selectedDaycare, setSelectedDaycare] = useState(null)
  const [applyingDaycare, setApplyingDaycare] = useState(null)

  const daycares = [
    {
      id: 1,
      name: 'Sunshine Daycare',
      location: 'Downtown',
      rating: 4.8,
      reviews: 156,
      fees: '$300/week',
      capacity: 'Available',
      image: '☀️',
      facilities: ['Play Area', 'Kitchen', 'Rest Room', 'CCTV'],
      hours: '08:00 AM - 06:00 PM'
    },
    {
      id: 2,
      name: 'Happy Kids Center',
      location: 'Suburbs',
      rating: 4.6,
      reviews: 98,
      fees: '$280/week',
      capacity: 'Available',
      image: '😊',
      facilities: ['Playground', 'Learning Center', 'Cafeteria', 'Security'],
      hours: '07:00 AM - 07:00 PM'
    },
    {
      id: 3,
      name: 'Little Explorers',
      location: 'Central',
      rating: 4.9,
      reviews: 203,
      fees: '$350/week',
      capacity: 'Limited',
      image: '🔭',
      facilities: ['Garden', 'Science Lab', 'Art Studio', 'Smart Board'],
      hours: '08:30 AM - 05:30 PM'
    }
  ]

  const admissions = [
    {
      id: 1,
      childName: 'Emma',
      daycareName: 'Sunshine Daycare',
      status: 'Active',
      enrollmentDate: '2026-03-15',
      dailyReport: 'Great day! Played with friends, ate well'
    }
  ]

  const dailyReports = [
    { time: '09:00 AM', activity: 'Arrival', detail: 'Happy to see friends' },
    { time: '10:00 AM', activity: 'Breakfast', detail: 'Toast, milk, and fruit' },
    { time: '12:00 PM', activity: 'Lunch', detail: 'Chicken rice and vegetables' },
    { time: '01:00 PM', activity: 'Nap', detail: 'Slept well' },
    { time: '03:00 PM', activity: 'Snack', detail: 'Cookies and juice' },
    { time: '04:00 PM', activity: 'Play', detail: 'Outdoor games' }
  ]

  const handleApplyClick = (daycare) => {
    setApplyingDaycare(daycare)
  }

  const submitApplication = async (e) => {
    e.preventDefault()
    try {
      await api.post('/daycare/apply', {
        daycareId: applyingDaycare.id,
        childName: e.target.childName.value
      })
      alert('Application submitted to ' + applyingDaycare.name)
      setApplyingDaycare(null)
      setSelectedDaycare(null)
    } catch (error) {
      console.error('Error applying:', error)
      alert('Application submitted successfully! (Mock)')
      setApplyingDaycare(null)
      setSelectedDaycare(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition text-sm">
          <span>←</span> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white">Daycare Management</h1>
        <p className="text-slate-300 mt-2">Manage daycare enrollment and track daily activities</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'browse'
              ? 'text-fuchsia-400 border-b-2 border-fuchsia-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🏫 Browse Daycares
        </button>
        <button
          onClick={() => setActiveTab('admission')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'admission'
              ? 'text-fuchsia-400 border-b-2 border-fuchsia-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📋 My Admissions
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'reports'
              ? 'text-fuchsia-400 border-b-2 border-fuchsia-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📊 Daily Reports
        </button>
      </div>

      {/* Browse Daycares */}
      {activeTab === 'browse' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daycares.map((daycare) => (
              <div key={daycare.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg transition">
                <div className="text-5xl mb-3">{daycare.image}</div>
                <h3 className="text-lg font-bold text-slate-900">{daycare.name}</h3>
                <p className="text-sm text-slate-600">{daycare.location}</p>

                <div className="flex items-center gap-2 my-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-semibold">{daycare.rating}</span>
                  <span className="text-xs text-slate-500">({daycare.reviews})</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg mb-3 text-sm space-y-1 text-slate-700">
                  <p><span className="font-semibold text-slate-900">Hours:</span> {daycare.hours}</p>
                  <p><span className="font-semibold text-slate-900">Fees:</span> {daycare.fees}</p>
                  <p><span className="font-semibold text-slate-900">Status:</span> {daycare.capacity}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {daycare.facilities.map((facility, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {facility}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDaycare(daycare)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApplyClick(daycare)}
                    className="flex-1 px-3 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition text-sm font-semibold"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Admissions */}
      {activeTab === 'admission' && (
        <div className="space-y-4">
          {admissions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <p className="text-slate-600 mb-4">No active admissions</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition"
              >
                Browse Daycares
              </button>
            </div>
          ) : (
            admissions.map((admission) => (
              <div key={admission.id} className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{admission.childName}</h3>
                    <p className="text-slate-600">{admission.daycareName}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {admission.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-slate-600"><span className="font-semibold">Enrollment Date:</span> {admission.enrollmentDate}</p>
                  <p className="text-sm text-slate-600 mt-2"><span className="font-semibold">Today's Note:</span> {admission.dailyReport}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                    View Attendance
                  </button>
                  <button className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition">
                    Contact Daycare
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Daily Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Activity Report - Emma</h3>
          <div className="space-y-3">
            {dailyReports.map((report, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border-l-4 border-fuchsia-500">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900">{report.time}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{report.activity}</h4>
                  <p className="text-sm text-slate-600">{report.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">📝 Parent Notes</h4>
            <textarea 
              placeholder="Add any notes or questions for the daycare staff..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              rows="3"
            ></textarea>
            <button className="mt-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition">
              Send Message
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDaycare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-5xl mb-2">{selectedDaycare.image}</div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedDaycare.name}</h2>
              </div>
              <button
                onClick={() => setSelectedDaycare(null)}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-slate-600">Rating</p>
                  <p className="text-lg font-bold text-slate-900">⭐ {selectedDaycare.rating}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-slate-600">Reviews</p>
                  <p className="text-lg font-bold text-slate-900">{selectedDaycare.reviews}</p>
                </div>
              </div>

              <p className="text-slate-600"><span className="font-semibold">Location:</span> {selectedDaycare.location}</p>
              <p className="text-slate-600"><span className="font-semibold">Hours:</span> {selectedDaycare.hours}</p>
              <p className="text-slate-600"><span className="font-semibold">Weekly Fees:</span> {selectedDaycare.fees}</p>

              <div>
                <p className="font-semibold text-slate-900 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDaycare.facilities.map((facility, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleApplyClick(selectedDaycare);
              }}
              className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
            >
              Apply for Admission
            </button>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {applyingDaycare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Apply to {applyingDaycare.name}</h2>
              <button onClick={() => setApplyingDaycare(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Child's Name</label>
                <input required name="childName" type="text" className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. Emma" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Child's Age</label>
                <input required type="number" className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. 4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Desired Start Date</label>
                <input required type="date" className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Special Requirements (Optional)</label>
                <textarea className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" rows="3" placeholder="Allergies, dietary needs..."></textarea>
              </div>
              <button type="submit" className="w-full mt-4 px-4 py-3 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-700 transition shadow-lg">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
