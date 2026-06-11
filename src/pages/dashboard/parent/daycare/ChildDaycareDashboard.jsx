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
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 text-slate-900 p-4 md:p-8 font-sans pb-24 relative overflow-hidden -m-6">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-fuchsia-50 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 mt-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Parent Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage your children's daycare activities, payments, and schedules.</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all duration-300 shadow-sm font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>Options</span>
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                <button onClick={() => navigate('/dashboard/settings')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 font-semibold transition-colors">Profile Settings</button>
                <button onClick={() => handleAction('Notification Preferences')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 font-semibold transition-colors">Notifications</button>
                <button onClick={() => handleAction('Billing details')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 font-semibold transition-colors">Billing</button>
              </div>
            )}
          </div>
        </div>

        {/* Children Selector & Current Enrollment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
            <h2 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Enrolled Children</h2>
            
            <div className="flex flex-wrap gap-4 mb-8 relative z-10">
              {children.map(child => (
                <button 
                  key={child.id}
                  onClick={() => setActiveChild(child.id)}
                  className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 overflow-hidden ${activeChild === child.id ? 'border-fuchsia-500 bg-fuchsia-50 shadow-sm scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <img src={child.avatar} alt={child.name} className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm relative z-10" />
                  <div className="text-left relative z-10">
                    <div className="font-bold text-slate-900 text-base">{child.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{child.age}</div>
                  </div>
                </button>
              ))}
              <button 
                onClick={() => navigate('/dashboard/parent/daycare')}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 bg-slate-50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl text-fuchsia-600 font-bold">+</div>
                <div className="font-semibold text-sm">Add Child</div>
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
              <button onClick={() => navigate(`/dashboard/parent/daycare/${activeChild}/chat`)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-sm hover:-translate-y-1">
                <span className="text-blue-500 text-2xl">💬</span>
                <span className="text-xs font-bold text-slate-700">Message</span>
              </button>
              <button onClick={() => navigate(`/dashboard/parent/daycare/${activeChild}/cctv`)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-sm hover:-translate-y-1">
                <span className="text-red-500 text-2xl">📹</span>
                <span className="text-xs font-bold text-slate-700">Live CCTV</span>
              </button>
              <button onClick={() => handleAction('Schedule View')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-sm hover:-translate-y-1">
                <span className="text-emerald-500 text-2xl">📅</span>
                <span className="text-xs font-bold text-slate-700">Schedule</span>
              </button>
              <button onClick={() => handleAction('Download Reports')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-sm hover:-translate-y-1">
                <span className="text-purple-500 text-2xl">📊</span>
                <span className="text-xs font-bold text-slate-700">Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="text-fuchsia-600 font-bold uppercase tracking-wider text-xs mb-1">Current Facility</h2>
                <h3 className="text-xl font-bold text-slate-900">Little Stars Daycare</h3>
              </div>
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ACTIVE
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 relative z-10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 text-xs mb-1 font-semibold">Enrolled Since</div>
                  <div className="font-bold text-slate-900">Jan 10, 2024</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-1 font-semibold">Plan</div>
                  <div className="font-bold text-fuchsia-600">Full-Time Care</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-600 to-fuchsia-800 rounded-2xl p-5 relative z-10 shadow-md">
               <div className="text-white/80 text-xs mb-1 font-semibold">Next Payment Due</div>
               <div className="text-3xl font-black text-white mb-1 tracking-tight">$1200<span className="text-lg font-medium text-white/80">.00</span></div>
               <div className="text-white/80 text-xs mb-4 font-semibold">Due: Mar 1, 2024</div>
               <button onClick={() => navigate(`/dashboard/parent/daycare/${activeChild}/payment`)} className="w-full bg-white text-fuchsia-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                 Pay Now
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Activity Report */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-bold text-slate-900">Today's Activity</h2>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="animate-spin-slow">↻</span> Last updated: 3:45 PM
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2">😊</div>
                  <div className="text-xs font-bold text-amber-700 mb-0.5">Mood</div>
                  <div className="font-bold text-sm text-slate-900">Happy</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2">🍴</div>
                  <div className="text-xs font-bold text-emerald-700 mb-0.5">Meals</div>
                  <div className="font-bold text-sm text-slate-900">3/3</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2">💤</div>
                  <div className="text-xs font-bold text-blue-700 mb-0.5">Nap Time</div>
                  <div className="font-bold text-sm text-slate-900">2 hours</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 transition-transform hover:-translate-y-1 duration-300">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-xs font-bold text-purple-700 mb-0.5">Activities</div>
                  <div className="font-bold text-sm text-slate-900">6 events</div>
                </div>
              </div>

              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[76px] before:-translate-x-px before:h-full before:w-px before:bg-slate-200 z-10">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-start py-5 group/timeline">
                    <div className="w-[76px] shrink-0 text-xs text-slate-500 font-bold pt-1 pr-4 text-right">{item.time}</div>
                    <div className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-sm absolute left-[76px] -translate-x-1/2 top-6 z-10 group-hover/timeline:scale-125 transition-transform duration-300 border-2 border-white"></div>
                    <div className="pl-6 flex-1 bg-white hover:bg-slate-50 rounded-2xl p-4 -mt-3 transition-colors duration-300 border border-transparent hover:border-slate-200">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-bold text-slate-900 text-base">{item.title}</span>
                        {item.tags?.map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                            <span className={tag === 'Photo' ? 'text-blue-500' : 'text-red-500'}>{tag === 'Photo' ? '📷' : '🎥'}</span> {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-slate-600 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => handleAction('Full Daily Report')} className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10 shadow-sm">
                View Detailed Report
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Recent Milestones */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-slate-900 font-bold mb-6 text-lg">Milestones & Progress</h2>
              <div className="space-y-4 relative z-10">
                {milestones.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center text-lg border border-fuchsia-200">
                      {m.icon}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{m.title}</div>
                      <div className="text-xs text-slate-500 font-semibold">{m.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-slate-900 font-bold mb-6 text-lg">Upcoming Events</h2>
              <div className="space-y-4 relative z-10">
                {events.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-900 shrink-0 group-hover:border-fuchsia-500 transition-colors">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-fuchsia-600">{e.date.split(' ')[0]}</div>
                      <div className="text-xl font-black leading-none mt-0.5">{e.date.split(' ')[1]}</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{e.title}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="text-fuchsia-600">⏱</span> {e.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-slate-900 font-bold mb-6 text-lg">Notifications</h2>
              <div className="space-y-4 relative z-10">
                {notifications.map((n, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${n.color} text-white flex items-center justify-center text-sm shadow-sm shrink-0`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{n.title}</div>
                      <div className="text-xs text-slate-600 mb-1">{n.desc}</div>
                      <div className="text-[10px] font-bold text-slate-400">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
              <h2 className="text-red-700 font-bold mb-5 text-lg relative z-10 flex items-center gap-2">
                <span>🚨</span> Emergency Contacts
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">Daycare Hotline</div>
                  <div className="font-bold text-red-700 text-sm bg-white py-1.5 px-3 rounded-lg border border-red-200 inline-block shadow-sm">+1 (555) 987-6543</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">24/7 Support</div>
                  <div className="font-bold text-red-700 text-sm bg-white py-1.5 px-3 rounded-lg border border-red-200 inline-block shadow-sm">+1 (800) 123-4567</div>
                </div>
              </div>
              <button onClick={() => handleAction('Emergency Alert Sent')} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-sm relative z-10 active:scale-95">
                Trigger Emergency Alert
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

