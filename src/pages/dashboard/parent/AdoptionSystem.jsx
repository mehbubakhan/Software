import React, { useState } from 'react'
import api from '../../../services/api'

export default function AdoptionSystem() {
  const [activeTab, setActiveTab] = useState('browse')
  const [applications, setApplications] = useState([
    { id: 1, childName: 'Lucas', age: '4 years', status: 'Under Review', lastUpdate: '3 days ago' },
  ])
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const adoptableChildren = [
    {
      id: 1,
      name: 'Lucas',
      age: '4 years',
      interests: ['Drawing', 'Sports', 'Music'],
      background: 'Loving, curious, and social',
      image: '👦',
      verified: true
    },
    {
      id: 2,
      name: 'Sofia',
      age: '6 years',
      interests: ['Reading', 'Science', 'Art'],
      background: 'Intelligent, creative, and kind',
      image: '👧',
      verified: true
    },
    {
      id: 3,
      name: 'Marco',
      age: '3 years',
      interests: ['Toys', 'Playing', 'Learning'],
      background: 'Active, playful, and energetic',
      image: '👦',
      verified: true
    },
  ]

  const meetupSchedule = [
    { id: 1, childName: 'Lucas', date: '2026-05-25', time: '10:00 AM', location: 'Orphanage Center', status: 'Confirmed' },
    { id: 2, childName: 'Sofia', date: '2026-05-27', time: '02:00 PM', location: 'Community Hall', status: 'Pending' },
  ]

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    try {
      await api.post('/adoption/apply', {
        // Form data would go here
      })
      alert('Application submitted successfully!')
      setShowApplicationForm(false)
    } catch (error) {
      console.error('Error submitting application:', error)
    }
  }

  const handleMeetupConfirmation = (meetupId) => {
    alert('Meetup confirmation sent!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Adoption Services</h1>
        <p className="text-slate-600 mt-2">Find and adopt a child - Build your family</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'browse'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👶 Browse Children
        </button>
        <button
          onClick={() => setActiveTab('application')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'application'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 My Applications
        </button>
        <button
          onClick={() => setActiveTab('meetups')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'meetups'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📅 Scheduled Meetups
        </button>
      </div>

      {/* Browse Children Tab */}
      {activeTab === 'browse' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adoptableChildren.map((child) => (
              <div key={child.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg transition">
                <div className="text-6xl mb-3 flex items-center justify-center">{child.image}</div>

                <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">{child.name}</h3>
                <p className="text-center text-slate-600 mb-3 font-semibold">{child.age}</p>

                <div className="bg-slate-50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-slate-600 mb-2"><span className="font-semibold">About:</span> {child.background}</p>
                  <p className="text-sm text-slate-600"><span className="font-semibold">Interests:</span> {child.interests.join(', ')}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                    📞 Know More
                  </button>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Applications Tab */}
      {activeTab === 'application' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <p className="text-slate-600 mb-4">No applications yet</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition"
              >
                Browse Children
              </button>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Application for {app.childName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-4">Last updated: {app.lastUpdate}</p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-sm text-slate-600"><span className="font-semibold">Application Stage:</span> Document Review</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition">
                      Update Application
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => setShowApplicationForm(true)}
            className="w-full px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold text-lg"
          >
            ➕ Start New Application
          </button>
        </div>
      )}

      {/* Scheduled Meetups Tab */}
      {activeTab === 'meetups' && (
        <div className="space-y-4">
          {meetupSchedule.map((meetup) => (
            <div key={meetup.id} className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Meetup with {meetup.childName}</h3>
                  <p className="text-slate-600 text-sm">📍 {meetup.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  meetup.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {meetup.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-slate-600">Date & Time</p>
                  <p className="font-semibold text-slate-900">📅 {meetup.date} at {meetup.time}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-slate-600">Location</p>
                  <p className="font-semibold text-slate-900">📍 {meetup.location}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMeetupConfirmation(meetup.id)}
                  className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition"
                >
                  Confirm Attendance
                </button>
                <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                  Reschedule
                </button>
              </div>

              <button className="w-full mt-3 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-slate-900">
                Submit Feedback & Q&A
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Adoption Application</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required />
                <input type="text" placeholder="Last Name" className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required />
              </div>

              <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required />
              <input type="tel" placeholder="Phone" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required />
              <input type="text" placeholder="Home Address" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required />

              <textarea placeholder="Family Background & Why you want to adopt" rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required></textarea>

              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" required>
                <option value="">Select preferred child age</option>
                <option value="0-2">0-2 years</option>
                <option value="2-4">2-4 years</option>
                <option value="4-6">4-6 years</option>
                <option value="6+">6+ years</option>
              </select>

              <label className="flex items-center gap-2">
                <input type="checkbox" required className="w-4 h-4" />
                <span className="text-sm text-slate-600">I agree to the adoption process terms and conditions</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
