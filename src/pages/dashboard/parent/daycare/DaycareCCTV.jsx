import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveCameraFeed } from '../../../../components/LiveCameraFeed';

export default function DaycareCCTV() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState('Main Play Room');

  const rooms = [
    { id: 1, name: 'Main Play Room', status: 'online' },
    { id: 2, name: 'Outdoor Playground', status: 'online' },
    { id: 3, name: 'Nap Room', status: 'offline' },
    { id: 4, name: 'Art & Craft Studio', status: 'online' },
    { id: 5, name: 'Dining Area', status: 'online' },
    { id: 6, name: 'Main Entrance', status: 'online' }
  ];

  const recentRecordings = [
    { id: 1, name: 'Main Play Room', date: 'Today, 10:00 AM', duration: '1h 30m' },
    { id: 2, name: 'Outdoor Playground', date: 'Today, 11:45 AM', duration: '45m' },
    { id: 3, name: 'Art Studio', date: 'Yesterday, 10:00 AM', duration: '2h 10m' },
    { id: 4, name: 'Dining Area', date: 'Yesterday, 12:30 PM', duration: '1h 15m' }
  ];

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans pb-24">
      <div className="max-w-6xl mx-auto mt-4">
        
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 transition text-sm font-semibold">
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full border border-red-500/20 text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE CCTV
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR - ROOMS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-4 h-[500px] overflow-y-auto">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>📹</span> Cameras
              </h3>
              <div className="space-y-2">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.name)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition ${activeRoom === room.name ? 'bg-fuchsia-600 text-white' : 'bg-[#111322] border border-slate-700 text-slate-300 hover:border-fuchsia-500 hover:text-fuchsia-400'}`}
                  >
                    <div className="font-bold text-sm">{room.name}</div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                      <span className={room.status === 'online' ? 'text-green-400' : 'text-slate-500'}>{room.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Live CCTV Features</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> 24/7 live streaming</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> High-def video & audio</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> 7-day recording history</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> Downloadable video clips</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> Multi-room access</li>
              </ul>
            </div>
          </div>

          {/* RIGHT CONTENT - VIDEO PLAYER */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE
              </div>
              <div className="absolute top-4 right-4 z-10 text-white text-xs bg-black/50 px-3 py-1 rounded">
                3:45:01 PM
              </div>

              {/* MOCK VIDEO PLAYER -> NOW LIVE */}
              <div className="w-full aspect-video bg-black flex flex-col items-center justify-center relative group overflow-hidden">
                <LiveCameraFeed className="absolute inset-0 z-0" />
                <div className="z-10 absolute bottom-4 left-4 bg-black/60 px-3 py-2 rounded-lg">
                  <div className="text-white font-bold text-xl">{activeRoom}</div>
                  <div className="text-slate-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Stream Active
                  </div>
                </div>
              </div>

              {/* PLAYER CONTROLS */}
              <div className="bg-[#1a1c2d] p-4 flex items-center justify-between border-t border-slate-700">
                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center text-white hover:bg-fuchsia-700 transition">
                    ⏸
                  </button>
                  <button className="text-slate-400 hover:text-white transition">⟲</button>
                  <button className="text-slate-400 hover:text-white transition">🔈</button>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-sm font-semibold text-slate-300 border border-slate-600 px-4 py-1.5 rounded-lg hover:text-white hover:border-slate-400 transition flex items-center gap-2">
                    ⬇ Save Clip
                  </button>
                  <button className="text-slate-400 hover:text-white transition">⛶</button>
                </div>
              </div>
            </div>

            {/* RECENT RECORDINGS */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Recent Recordings (Last 7 Days)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentRecordings.map(rec => (
                  <div key={rec.id} className="bg-[#111322] border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-fuchsia-500 transition cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl group-hover:bg-fuchsia-600/20 group-hover:text-fuchsia-500 transition">
                        🎥
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{rec.name}</div>
                        <div className="text-xs text-slate-500">{rec.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-1">Duration: {rec.duration}</div>
                      <div className="text-fuchsia-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        ▶ Watch
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Alert */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-200 flex items-start gap-3">
              <span>🔒</span>
              <p>
                <strong>Privacy & Security:</strong> All CCTV feeds are encrypted and accessed only by authorized parents. Recordings are stored securely for 7 days and then automatically deleted. This activity is monitored and restricted to ensure your child's privacy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
