import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Square, 
  MapPin, 
  Baby, 
  PhoneCall, 
  MessageCircle, 
  AlertCircle,
  Smile,
  Meh,
  Frown,
  CalendarDays,
  X,
  Send,
  Video,
  ChevronLeft
} from 'lucide-react';
import { useRealGPS } from '../../../hooks/useRealGPS';

export default function ActiveJobs() {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [mood, setMood] = useState(null);
  const { location: realLocation, error: gpsError, isTracking } = useRealGPS(sessionActive);
  
  // Interactive Modals
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: "Hi Sarah, is Ayaan taking his nap yet?", sender: "family" }
  ]);
  const [callActive, setCallActive] = useState(false);
  const [callPerson, setCallPerson] = useState('');

  useEffect(() => {
    let interval = null;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(time => time + 1);
      }, 1000);
    } else if (!sessionActive && sessionTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionActive, sessionTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const toggleSession = () => {
    if (!sessionActive) {
      setSessionActive(true);
      alert('Session Started! Live GPS tracking is now active.');
    } else {
      if(window.confirm('Check out of the current work session?')) {
        setSessionActive(false);
        setSessionTime(0);
        setMood(null);
        alert('Session Ended. Work hours logged successfully.');
      }
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if(!chatMessage) return;
    setChatHistory(prev => [...prev, { text: chatMessage, sender: "nanny" }]);
    setChatMessage('');
  };

  const startCall = (person) => {
    setCallPerson(person);
    setCallActive(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-slate-900">Active Work Mode</h1>
          <p className="text-slate-500 mt-1">Manage your current active job session with the Ahmed Family.</p>
        </div>
        
        {sessionActive && (
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs">Live Tracking Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Work Timer Control */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center relative overflow-hidden">
            {sessionActive && (
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"></div>
            )}
            
            <h2 className="text-lg font-bold text-slate-500 mb-2 uppercase tracking-widest">Session Duration</h2>
            <div className={`text-6xl font-black mb-8 transition-colors ${sessionActive ? 'text-slate-900 font-mono' : 'text-slate-300'}`}>
              {formatTime(sessionTime)}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              {sessionActive ? (
                <button 
                  onClick={toggleSession}
                  className="flex-1 bg-[#e11d48] hover:bg-[#be123c] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Square className="w-5 h-5 fill-current" /> Check-out
                </button>
              ) : (
                <button 
                  onClick={toggleSession}
                  className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" /> Check-in & Start Work
                </button>
              )}
            </div>
          </div>

          {/* Map View */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" /> Live GPS Tracking
            </h2>
            <div className={`bg-slate-50 rounded-xl h-72 flex flex-col items-center justify-center border transition-colors ${sessionActive ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>
              {sessionActive ? (
                <>
                  <MapPin className="w-12 h-12 text-emerald-500 mb-3 animate-bounce shadow-sm rounded-full" />
                  <div className="text-emerald-800 font-bold">GPS Connected</div>
                  {gpsError ? (
                    <div className="text-red-500 text-sm mt-1">{gpsError}</div>
                  ) : realLocation.latitude ? (
                    <div className="text-emerald-600/70 text-sm mt-1 text-center">
                      Sharing location with parents<br/>
                      Lat: {realLocation.latitude}°, Lng: {realLocation.longitude}°<br/>
                      <span className="text-xs">Updated: {realLocation.timestamp}</span>
                    </div>
                  ) : (
                    <div className="text-emerald-600/70 text-sm mt-1">Acquiring satellite signal...</div>
                  )}
                </>
              ) : (
                <>
                  <MapPin className="w-12 h-12 text-slate-300 mb-3" />
                  <div className="text-slate-400 font-bold">Map Offline</div>
                  <div className="text-slate-400/70 text-sm mt-1">Start session to enable tracking</div>
                </>
              )}
            </div>
          </div>

          {/* Child Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <CalendarDays className="w-5 h-5 text-purple-500" /> Today's Child Schedule (Ayaan)
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-16 text-sm font-bold text-slate-400 pt-1">10:00 AM</div>
                <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="font-bold text-blue-900">Morning Snack</div>
                  <div className="text-blue-700 text-sm mt-1">Fruit puree (in fridge) & milk.</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-16 text-sm font-bold text-slate-400 pt-1">11:30 AM</div>
                <div className="flex-1 bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <div className="font-bold text-purple-900">Nap Time</div>
                  <div className="text-purple-700 text-sm mt-1">Usually sleeps for 1.5 - 2 hours. Play white noise machine.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Work Mood Check-in */}
          <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Work Mood Check-in</h2>
            <p className="text-slate-500 text-sm mb-6">How are you feeling during this session?</p>
            
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setMood('happy')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mood === 'happy' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-200'}`}>
                <Smile className={`w-8 h-8 mb-2 ${mood === 'happy' ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${mood === 'happy' ? 'text-emerald-700' : 'text-slate-500'}`}>Happy</span>
              </button>
              <button onClick={() => setMood('normal')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mood === 'normal' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
                <Meh className={`w-8 h-8 mb-2 ${mood === 'normal' ? 'text-blue-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${mood === 'normal' ? 'text-blue-700' : 'text-slate-500'}`}>Normal</span>
              </button>
              <button onClick={() => setMood('stress')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mood === 'stress' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-200'}`}>
                <Frown className={`w-8 h-8 mb-2 ${mood === 'stress' ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${mood === 'stress' ? 'text-orange-700' : 'text-slate-500'}`}>Stressed</span>
              </button>
            </div>
            
            {mood === 'stress' && (
              <div className="mt-4 bg-orange-100 text-orange-800 text-xs p-3 rounded-lg font-medium flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> Note taken. If you feel overwhelmed, remember you can request a break in Settings.
              </div>
            )}
            {mood === 'happy' && (
              <div className="mt-4 bg-emerald-100 text-emerald-800 text-xs p-3 rounded-lg font-medium flex gap-2">
                <Smile className="w-4 h-4 shrink-0" /> Glad you are having a great time!
              </div>
            )}
          </div>

          {/* Child Info & Care Instructions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Baby className="w-5 h-5 text-pink-500" /> Child Care Info
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Child Name</div>
                <div className="font-bold text-slate-800">Ayaan Ahmed (2 years)</div>
              </div>
              <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                <div className="text-xs text-red-500 font-bold uppercase mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Allergies
                </div>
                <div className="font-bold text-red-900 text-sm">Severe Peanut Allergy. Epi-pen in bag.</div>
              </div>
            </div>
          </div>

          {/* Parent Communication */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Parent Contact</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowChat(true)}
                className="w-full bg-[#1a56db] hover:bg-blue-700 text-white px-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> Quick Chat
              </button>
              <div className="flex gap-3">
                <button onClick={() => startCall('Mom')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <PhoneCall className="w-4 h-4" /> Mom
                </button>
                <button onClick={() => startCall('Dad')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <PhoneCall className="w-4 h-4" /> Dad
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals for Interactivity */}
      
      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#1a56db] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black">
                  A
                </div>
                <div>
                  <h3 className="font-bold leading-tight">Ahmed Family</h3>
                  <p className="text-xs text-blue-200">Online</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="hover:bg-blue-700 p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col justify-end gap-3">
              <div className="text-center text-xs text-slate-400 font-medium mb-2">Today, 9:41 AM</div>
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl max-w-[85%] shadow-sm text-[15px] ${
                    msg.sender === 'family' 
                      ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none self-start' 
                      : 'bg-[#1a56db] text-white rounded-tr-none self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <button type="submit" className="bg-[#1a56db] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {callActive && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Calling {callPerson}...</h2>
            <p className="text-slate-300 text-sm mb-8">Connecting securely via SafeNanny relay</p>
            
            <button onClick={() => setCallActive(false)} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-colors shadow-lg shadow-red-500/20">
              <PhoneCall className="w-6 h-6 rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
