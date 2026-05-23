import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChildDaycareDashboard() {
  const navigate = useNavigate();
  const [activeChild, setActiveChild] = useState(1);
  const [showOptions, setShowOptions] = useState(false);

  const children = [
    { id: 1, name: 'Emma Thompson', age: '3 years old', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
    { id: 2, name: 'Oliver Thompson', age: '5 years old', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver' }
  ];

  const timeline = [
    { time: '3:00 PM', title: 'Art & Craft', tags: ['Photo'], desc: 'Created a beautiful finger painting.' },
    { time: '2:30 PM', title: 'Snack Time', desc: 'Ate apple slices, crackers.' },
    { time: '12:30 PM', title: 'Nap Time', desc: 'Slept for 2 hours - excellent quality.' },
    { time: '11:30 AM', title: 'Lunch', tags: ['Photo'], desc: 'Chicken nuggets, veggies, milk - 90% eaten.' },
    { time: '10:30 AM', title: 'Outdoor Play', tags: ['Video'], desc: 'Active social interaction with peers.' }
  ];

  const milestones = [
    { icon: '🎯', title: 'Learned to count to 20!', date: 'Feb 15' },
    { icon: '🧩', title: 'First time sharing toys independently', date: 'Feb 10' },
    { icon: '🔤', title: 'Recognized all alphabet letters', date: 'Feb 5' }
  ];

  const events = [
    { date: 'Feb 24', title: 'Parent-Teacher Meeting', time: '10:00 AM' },
    { date: 'Mar 5', title: 'Spring Art Exhibition', time: '2:00 PM' },
    { date: 'Mar 12', title: 'Field Trip - Science Museum', time: '9:00 AM' }
  ];

  const notifications = [
    { icon: '💊', color: 'from-blue-500 to-cyan-500', title: 'Medication Given by Nurse Jane', desc: 'Antibiotic administered at 1:00 PM', time: '2 hours ago' },
    { icon: '💳', color: 'from-green-500 to-emerald-500', title: 'Payment Received', desc: 'February tuition confirmed', time: 'Yesterday' },
    { icon: '📷', color: 'from-amber-400 to-orange-500', title: 'New Photos Available', desc: '4 new photos from art class', time: '2 days ago' }
  ];

  const handleAction = (action) => {
    // Show toast or navigate
    alert(`${action} feature coming soon!`);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-fuchsia-900/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400 tracking-tight">Parent Dashboard</h1>
            <p className="text-slate-400 mt-2">Manage your children's daycare activities, payments, and schedules.</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>Options</span>
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-[#151923]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                <button onClick={() => navigate('/dashboard/settings')} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-fuchsia-500/20 hover:text-white transition-colors">Profile Settings</button>
                <button onClick={() => handleAction('Notification Preferences')} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-fuchsia-500/20 hover:text-white transition-colors">Notifications</button>
                <button onClick={() => handleAction('Billing details')} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-fuchsia-500/20 hover:text-white transition-colors">Billing</button>
              </div>
            )}
          </div>
        </div>

        {/* Children Selector & Current Enrollment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#121622]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-fuchsia-500/20 transition-all duration-500"></div>
            <h2 className="text-xl font-bold text-white mb-6 relative z-10">Enrolled Children</h2>
            
            <div className="flex flex-wrap gap-4 mb-8 relative z-10">
              {children.map(child => (
                <button 
                  key={child.id}
                  onClick={() => setActiveChild(child.id)}
                  className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 overflow-hidden ${activeChild === child.id ? 'border-fuchsia-500/50 bg-gradient-to-r from-fuchsia-900/40 to-blue-900/40 shadow-[0_0_20px_rgba(217,70,239,0.15)] scale-[1.02]' : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
                >
                  {activeChild === child.id && <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-blue-500/10"></div>}
                  <img src={child.avatar} alt={child.name} className="w-12 h-12 rounded-full bg-slate-800 border-2 border-white/10 relative z-10" />
                  <div className="text-left relative z-10">
                    <div className="font-bold text-white text-base">{child.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{child.age}</div>
                  </div>
                </button>
              ))}
              <button 
                onClick={() => navigate('/dashboard/parent/daycare')}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">+</div>
                <div className="font-semibold text-sm">Add Child</div>
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
              <button onClick={() => navigate(`/dashboard/parent/daycare/${activeChild}/chat`)} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:-translate-y-1">
                <span className="text-blue-400 text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">💬</span>
                <span className="text-xs font-semibold text-slate-300">Message</span>
              </button>
              <button onClick={() => navigate(`/dashboard/parent/daycare/${activeChild}/cctv`)} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:-translate-y-1">
                <span className="text-red-400 text-2xl drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">📹</span>
                <span className="text-xs font-semibold text-slate-300">Live CCTV</span>
              </button>
              <button onClick={() => handleAction('Schedule View')} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:-translate-y-1">
                <span className="text-emerald-400 text-2xl drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">📅</span>
                <span className="text-xs font-semibold text-slate-300">Schedule</span>
              </button>
              <button onClick={() => handleAction('Download Reports')} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:-translate-y-1">
                <span className="text-purple-400 text-2xl drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">📊</span>
                <span className="text-xs font-semibold text-slate-300">Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#121622] to-[#1a1528] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
             <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="text-fuchsia-400 font-bold uppercase tracking-wider text-xs mb-1">Current Facility</h2>
                <h3 className="text-xl font-bold text-white">Little Stars Daycare</h3>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ACTIVE
              </div>
            </div>
            
            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 mb-6 relative z-10 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 text-xs mb-1">Enrolled Since</div>
                  <div className="font-semibold text-slate-200">Jan 10, 2024</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-1">Plan</div>
                  <div className="font-semibold text-fuchsia-300">Full-Time Care</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-600 to-blue-600 rounded-2xl p-5 relative z-10 shadow-lg shadow-fuchsia-900/20">
               <div className="text-white/80 text-xs mb-1">Next Payment Due</div>
               <div className="text-3xl font-black text-white mb-1 tracking-tight">$1200<span className="text-lg font-medium text-white/70">.00</span></div>
               <div className="text-white/80 text-xs mb-4">Due: Mar 1, 2024</div>
               <button onClick={() => navigate(`/dashboard/parent/daycare/${activeChild}/payment`)} className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                 Pay Now
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Activity Report */}
            <div className="bg-[#121622]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-bold text-white">Today's Activity</h2>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="animate-spin-slow">↻</span> Last updated: 3:45 PM
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2 drop-shadow-md">😊</div>
                  <div className="text-xs font-medium text-amber-500/70 mb-0.5">Mood</div>
                  <div className="font-bold text-sm text-amber-50">Happy</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2 drop-shadow-md">🍴</div>
                  <div className="text-xs font-medium text-emerald-500/70 mb-0.5">Meals</div>
                  <div className="font-bold text-sm text-emerald-50">3/3</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2 drop-shadow-md">💤</div>
                  <div className="text-xs font-medium text-blue-500/70 mb-0.5">Nap Time</div>
                  <div className="font-bold text-sm text-blue-50">2 hours</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2 drop-shadow-md">⚡</div>
                  <div className="text-xs font-medium text-purple-500/70 mb-0.5">Activities</div>
                  <div className="font-bold text-sm text-purple-50">6 events</div>
                </div>
              </div>

              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[76px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-fuchsia-500/50 before:via-blue-500/20 before:to-transparent z-10">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-start py-5 group/timeline">
                    <div className="w-[76px] shrink-0 text-xs text-slate-400 font-medium pt-1 pr-4 text-right">{item.time}</div>
                    <div className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] absolute left-[76px] -translate-x-1/2 top-6 z-10 group-hover/timeline:scale-125 transition-transform duration-300"></div>
                    <div className="pl-6 flex-1 bg-white/0 hover:bg-white/5 rounded-2xl p-4 -mt-3 transition-colors duration-300 border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-bold text-slate-100 text-base">{item.title}</span>
                        {item.tags?.map(tag => (
                          <span key={tag} className="bg-white/10 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-1">
                            <span className={tag === 'Photo' ? 'text-blue-400' : 'text-red-400'}>{tag === 'Photo' ? '📷' : '🎥'}</span> {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-slate-400 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => handleAction('Full Daily Report')} className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10">
                View Detailed Report
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Recent Milestones */}
            <div className="bg-[#121622]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <h2 className="text-white font-bold mb-6 text-lg">Milestones & Progress</h2>
              <div className="space-y-4 relative z-10">
                {milestones.map((m, idx) => (
                  <div key={idx} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-blue-500/20 flex items-center justify-center text-lg border border-white/10 shadow-inner">
                      {m.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 text-sm leading-tight mb-1">{m.title}</div>
                      <div className="text-xs text-slate-500 font-medium">{m.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-[#121622]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <h2 className="text-white font-bold mb-6 text-lg">Upcoming Events</h2>
              <div className="space-y-4 relative z-10">
                {events.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex flex-col items-center justify-center text-white shrink-0 shadow-inner group-hover:border-fuchsia-500/50 transition-colors">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-fuchsia-400">{e.date.split(' ')[0]}</div>
                      <div className="text-xl font-black leading-none mt-0.5">{e.date.split(' ')[1]}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 text-sm">{e.title}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="text-fuchsia-400">⏱</span> {e.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#121622]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <h2 className="text-white font-bold mb-6 text-lg">Notifications</h2>
              <div className="space-y-4 relative z-10">
                {notifications.map((n, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${n.color} flex items-center justify-center text-sm shadow-lg shrink-0`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="font-semibold text-slate-200 text-sm leading-tight mb-1">{n.title}</div>
                      <div className="text-xs text-slate-400">{n.desc}</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-1.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-red-500/30 transition-colors duration-500"></div>
              <h2 className="text-red-400 font-bold mb-5 text-lg relative z-10 flex items-center gap-2">
                <span>🚨</span> Emergency Contacts
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-400/70 mb-1">Daycare Hotline</div>
                  <div className="font-bold text-red-400 text-sm bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 inline-block">+1 (555) 987-6543</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-400/70 mb-1">24/7 Support</div>
                  <div className="font-bold text-red-400 text-sm bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 inline-block">+1 (800) 123-4567</div>
                </div>
              </div>
              <button onClick={() => handleAction('Emergency Alert Sent')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] relative z-10 active:scale-95">
                Trigger Emergency Alert
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
