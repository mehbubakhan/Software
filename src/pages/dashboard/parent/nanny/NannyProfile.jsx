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
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

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
              <button className="px-6 py-4 border-b-2 border-indigo-500 text-indigo-400 font-semibold">Overview</button>
              <button className="px-6 py-4 text-slate-400 hover:text-white transition">Experience & Skills</button>
              <button className="px-6 py-4 text-slate-400 hover:text-white transition">Reviews ({profile.reviews})</button>
            </div>

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

          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-80 space-y-6">
            
            {/* Get in Touch */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Get in Touch</h3>
              <div className="space-y-3 mb-6">
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
            <div className="bg-slate-800 p-4 flex justify-between items-center">
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

    </div>
  )
}
