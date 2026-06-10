import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../../services/api'

export default function NannyProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showJobRequestModal, setShowJobRequestModal] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [jobRequest, setJobRequest] = useState({ date: '', time: '', description: '' })

  useEffect(() => {
    if (profile && messages.length === 0) {
      setMessages([{ id: 1, text: `Hi ${profile.name}, I'm interested in booking an interview!`, sender: 'me', time: 'Just now' }])
    }
  }, [profile, messages.length])

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    setNewMessage('');
  }

  const handleSendJobRequest = (e) => {
    e.preventDefault();
    alert(`Job request successfully sent to ${profile.name}! They will review it and get back to you shortly.`);
    setShowJobRequestModal(false);
    setJobRequest({ date: '', time: '', description: '' });
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/nanny/${id}`)
        setProfile(response.data.data)
      } catch (err) {
        console.error('Error fetching nanny profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) {
    return <div className="text-center text-slate-400 py-12">Loading profile...</div>
  }

  if (!profile) {
    return <div className="text-center text-slate-400 py-12">Profile not found.</div>
  }

  return (
    <div className="bg-[#111322] min-h-screen text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition">
          <span>←</span> Back to All Nannies
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-8">
            
            {/* Header Card */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center text-6xl relative shrink-0 shadow-lg shadow-indigo-500/20">
                  {profile.photo}
                  <span className="absolute bottom-0 right-0 bg-[#1a1c2d] p-1 rounded-full text-indigo-400 border border-slate-700">
                    🛡️
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">{profile.name} <span className="text-slate-500 font-normal">♡</span></h1>
                      <p className="text-slate-400">{profile.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg">★★★★★</span>
                      <span className="font-bold">{profile.rating}</span>
                      <span className="text-slate-400">({profile.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      📍 {profile.location}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ✓ Verified Professional
                    </span>
                    <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ★ Top Rated
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-700 text-center">
                <div>
                  <div className="text-indigo-400 mb-1 text-xl">🕒</div>
                  <p className="text-xs text-slate-400 mb-1">Availability</p>
                  <p className="font-bold">{profile.availability}</p>
                </div>
                <div>
                  <div className="text-indigo-400 mb-1 text-xl">💲</div>
                  <p className="text-xs text-slate-400 mb-1">Hourly Rate</p>
                  <p className="font-bold">{profile.rate}</p>
                </div>
                <div>
                  <div className="text-indigo-400 mb-1 text-xl">🏅</div>
                  <p className="text-xs text-slate-400 mb-1">Experience</p>
                  <p className="font-bold">{profile.experience}</p>
                </div>
                <div>
                  <div className="text-indigo-400 mb-1 text-xl">🌐</div>
                  <p className="text-xs text-slate-400 mb-1">Languages</p>
                  <p className="font-bold">{profile.languages}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition ${activeTab === 'overview' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('experience')}
                className={`px-6 py-4 font-semibold transition ${activeTab === 'experience' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                Experience & Skills
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-semibold transition ${activeTab === 'reviews' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                Reviews ({profile.reviews})
              </button>
            </div>

            {/* Content Switcher */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* About */}
                  <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-4">About {profile.name.split(' ')[0]}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {profile.about}
                    </p>
                  </div>

                  {/* Specializations */}
                  <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-4">Specializations</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.specializations.map((spec, idx) => (
                        <span key={idx} className="bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium border border-indigo-500/30">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Availability */}
                  <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">📅 Weekly Availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.weeklyAvailability.map((slot, idx) => (
                        <div key={idx} className={`flex justify-between p-4 rounded-xl border ${slot.available ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                          <span className="font-semibold text-sm">{slot.day}</span>
                          <span className="text-sm text-slate-400">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'experience' && (
                <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">💼 Work Experience</h3>
                    <div className="space-y-6">
                      <div className="border-l-2 border-indigo-500 pl-4 pb-2">
                        <h4 className="font-bold text-white text-lg">Senior Nanny</h4>
                        <p className="text-slate-400 text-sm mb-2">Private Family • 2020 - Present</p>
                        <p className="text-slate-300 text-sm">Cared for 2 children (ages 2 and 5). Responsible for daily routines, educational play, meal preparation, and light housekeeping related to children.</p>
                      </div>
                      <div className="border-l-2 border-indigo-500 pl-4 pb-2">
                        <h4 className="font-bold text-white text-lg">Daycare Assistant</h4>
                        <p className="text-slate-400 text-sm mb-2">Happy Kids Daycare • 2018 - 2020</p>
                        <p className="text-slate-300 text-sm">Assisted lead teachers with activities, supervised outdoor play, and managed nap times for groups of up to 12 toddlers.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🛠️ Professional Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Newborn Care', 'Potty Training', 'Meal Prep', 'CPR & First Aid', 'Homework Help', 'Behavioral Management'].map((skill, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-medium border border-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">⭐ Parent Reviews ({profile.reviews})</h3>
                  
                  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">SA</div>
                        <div>
                          <p className="font-bold text-white text-sm">Sarah Ahmed</p>
                          <p className="text-slate-400 text-xs">2 weeks ago</p>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm">★★★★★</div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Absolutely wonderful with our 3-year-old. Always on time, comes up with creative educational activities, and leaves the play area spotless. Highly recommend!"
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">MR</div>
                        <div>
                          <p className="font-bold text-white text-sm">Mubashir Rahman</p>
                          <p className="text-slate-400 text-xs">1 month ago</p>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm">★★★★★</div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Great experience. Very professional and our infant was extremely well cared for. Follows instructions perfectly."
                    </p>
                  </div>
                  
                  <button className="w-full py-3 mt-4 text-indigo-400 font-semibold hover:text-indigo-300 border border-indigo-500/30 rounded-xl transition">
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>



          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-80 space-y-6">
            
            {/* Get in Touch */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Get in Touch</h3>
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => setShowJobRequestModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>🤝</span> Send Job Request
                </button>
                <button 
                  onClick={() => alert(`Video interview request sent to ${profile.name}!`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>📹</span> Book Video Interview
                </button>
                <button 
                  onClick={() => setShowMessageModal(true)}
                  className="w-full bg-transparent hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>💬</span> Send Message
                </button>
                <button 
                  onClick={() => setShowPhone(!showPhone)}
                  className="w-full bg-transparent hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>📞</span> {showPhone ? (profile.phone || '+880 1234 567 890') : 'Request Call'}
                </button>
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-full font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 border ${isSaved ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-transparent hover:bg-slate-800 border-slate-700 text-white'}`}
                >
                  <span>🔖</span> {isSaved ? 'Profile Saved' : 'Save Profile'}
                </button>
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                <p className="flex items-center gap-2">✉️ Response within 24 hours</p>
                <p className="flex items-center gap-2">🛡️ Background verified</p>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🏅 Certifications</h3>
              <ul className="space-y-3">
                {profile.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-sm">
                    <span className="text-indigo-400 text-lg">✓</span>
                    <span className="text-slate-300">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🌐 Languages</h3>
              <ul className="space-y-3">
                {profile.knownLanguages.map((lang, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-sm">
                    <span className="text-slate-300">{lang.name}</span>
                    <span className="text-indigo-400 text-xs font-semibold">✓</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden flex flex-col h-[500px]">
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="font-bold text-white flex items-center gap-2"><span>✉️</span> Message {profile.name.split(' ')[0]}</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                  <div className={`${msg.sender === 'me' ? 'bg-indigo-600 rounded-tr-none' : 'bg-slate-800 rounded-tl-none'} rounded-2xl p-3 max-w-[80%]`}>
                    <p className="text-sm text-white">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 text-sm text-white focus:outline-none focus:border-indigo-500" 
              />
              <button type="submit" className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 hover:bg-indigo-500 transition">↑</button>
            </form>
          </div>
        </div>
      )}

      {/* Job Request Modal */}
      {showJobRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-start">
              <div>
                <h3 className="font-black text-white text-xl flex items-center gap-2"><span>🤝</span> Book {profile.name.split(' ')[0]}</h3>
                <p className="text-emerald-100 text-sm mt-1">Send a formal job request or booking inquiry</p>
              </div>
              <button onClick={() => setShowJobRequestModal(false)} className="text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
            </div>
            <form onSubmit={handleSendJobRequest} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={jobRequest.date}
                    onChange={(e) => setJobRequest({...jobRequest, date: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration / Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9 AM - 5 PM"
                    required
                    value={jobRequest.time}
                    onChange={(e) => setJobRequest({...jobRequest, time: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Details</label>
                <textarea 
                  required
                  placeholder="Describe your requirements, children's ages, and any special instructions..."
                  rows="4"
                  value={jobRequest.description}
                  onChange={(e) => setJobRequest({...jobRequest, description: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowJobRequestModal(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
