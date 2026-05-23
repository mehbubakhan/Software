import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChildDaycareDashboard() {
  const navigate = useNavigate();
  const [activeChild, setActiveChild] = useState(1);

  const children = [
    { id: 1, name: 'Emma Thompson', age: '3 years old', avatar: '👧' },
    { id: 2, name: 'Oliver Thompson', age: '5 years old', avatar: '👦' }
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
    { icon: '💊', color: 'text-blue-400', title: 'Medication Given by Nurse Jane', desc: 'Antibiotic administered at 1:00 PM', time: '2 hours ago' },
    { icon: '💳', color: 'text-green-400', title: 'Payment Received', desc: 'February tuition confirmed', time: 'Yesterday' },
    { icon: '📷', color: 'text-yellow-400', title: 'New Photos Available', desc: '4 new photos from art class', time: '2 days ago' }
  ];

  return (
    <div className="bg-[#0B0E14] min-h-[calc(100vh-68px)] text-slate-200 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header - My Enrolled Children */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6 text-center">
          <h1 className="text-xl font-bold text-white mb-6">My Enrolled Children</h1>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {children.map(child => (
              <button 
                key={child.id}
                onClick={() => setActiveChild(child.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition ${activeChild === child.id ? 'border-fuchsia-500 bg-[#1A1D27]' : 'border-[#2A2E3D] bg-[#0F111A] hover:border-slate-500'}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700">
                  {child.avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{child.name}</div>
                  <div className="text-xs text-slate-400">{child.age}</div>
                </div>
              </button>
            ))}
          </div>
          <button 
            onClick={() => navigate('/dashboard/parent/daycare')}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition"
          >
            Find Another Daycare
          </button>
        </div>

        {/* Current Enrollment */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-fuchsia-400 font-bold">Current Enrollment</h2>
            <div className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Active
            </div>
          </div>
          
          <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-xl p-5 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-xl text-white">🏢</div>
              <div>
                <h3 className="text-lg font-bold text-white">Little Stars Daycare</h3>
                <p className="text-sm text-slate-400">Full-Time Care Plan</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm border-t border-[#2A2E3D] pt-4">
              <div>
                <div className="text-slate-500 text-xs">Enrolled Since</div>
                <div className="font-bold text-slate-200 mt-0.5">Jan 10, 2024</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Status</div>
                <div className="font-bold text-green-400 mt-0.5">18 days active</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Duration</div>
                <div className="font-bold text-slate-200 mt-0.5">Last 6 months</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => navigate('/dashboard/parent/daycare/1/chat')} className="bg-white hover:bg-slate-100 text-slate-900 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 font-semibold text-xs transition">
              <span className="text-blue-500 text-lg">💬</span> Chat with Teacher
            </button>
            <button onClick={() => navigate('/dashboard/parent/daycare/1/cctv')} className="bg-white hover:bg-slate-100 text-slate-900 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 font-semibold text-xs transition">
              <span className="text-red-500 text-lg">📹</span> Watch Activity CCTV
            </button>
            <button className="bg-white hover:bg-slate-100 text-slate-900 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 font-semibold text-xs transition">
              <span className="text-green-500 text-lg">📅</span> View Schedule
            </button>
            <button className="bg-white hover:bg-slate-100 text-slate-900 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 font-semibold text-xs transition">
              <span className="text-purple-500 text-lg">📊</span> Download Reports
            </button>
          </div>
        </div>

        {/* Today's Activity Report */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-bold">Today's Activity Report</h2>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>↻</span> Last updated: 3:45 PM
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-50 rounded-xl p-4 text-slate-900">
              <div className="text-xl mb-1">😊</div>
              <div className="text-xs font-semibold text-slate-500">Mood</div>
              <div className="font-bold text-sm">Happy & Energetic</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-slate-900">
              <div className="text-xl mb-1">🍴</div>
              <div className="text-xs font-semibold text-slate-500">Meals</div>
              <div className="font-bold text-sm">3/3</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-slate-900">
              <div className="text-xl mb-1">💤</div>
              <div className="text-xs font-semibold text-slate-500">Nap Time</div>
              <div className="font-bold text-sm">2 hours</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-slate-900">
              <div className="text-xl mb-1">⚡</div>
              <div className="text-xs font-semibold text-slate-500">Activities</div>
              <div className="font-bold text-sm">6 events</div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-300 mb-4">Activity Timeline</h3>
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[68px] before:-translate-x-px before:h-full before:w-0.5 before:bg-[#2A2E3D]">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start py-4">
                <div className="w-[68px] shrink-0 text-xs text-slate-400 font-semibold pt-1">{item.time}</div>
                <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 ring-4 ring-[#151821] absolute left-[68px] -translate-x-1/2 top-5 z-10"></div>
                <div className="pl-6 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-200 text-sm">{item.title}</span>
                    {item.tags?.map(tag => (
                      <span key={tag} className="bg-fuchsia-600/20 text-fuchsia-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-fuchsia-500/30">
                        {tag === 'Photo' ? '📷' : '🎥'} {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-lg transition text-sm">
            View Full Daily Report
          </button>
        </div>

        {/* Recent Milestones & Progress */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-fuchsia-400">📈</span> Recent Milestones & Progress
          </h2>
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="bg-[#0B0E14] border border-[#2A2E3D] rounded-xl p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-fuchsia-600/20 flex items-center justify-center text-sm border border-fuchsia-500/30">
                  {m.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-sm">{m.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">💲</span> Payment Information
          </h2>
          <div className="bg-[#0B0E14] border border-[#2A2E3D] rounded-xl p-5 mb-4">
            <div className="text-xs text-slate-500 mb-1">Next Payment Due</div>
            <div className="text-2xl font-bold text-white mb-1">$1200</div>
            <div className="text-xs text-slate-400">Due: Mar 1, 2024</div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/dashboard/parent/daycare/1/payment')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition text-sm">
              Pay Now
            </button>
            <button className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-lg transition text-sm">
              View Payment History
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">📅</span> Upcoming Events
          </h2>
          <div className="space-y-3">
            {events.map((e, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-600 flex flex-col items-center justify-center text-white shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider">{e.date.split(' ')[0]}</div>
                  <div className="text-lg font-bold leading-none">{e.date.split(' ')[1]}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-sm">{e.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">⏱ {e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-400">🔔</span> Recent Notifications
          </h2>
          <div className="space-y-3">
            {notifications.map((n, idx) => (
              <div key={idx} className="bg-[#0B0E14] border border-[#2A2E3D] rounded-xl p-4 flex items-start gap-4">
                <div className={`mt-0.5 ${n.color}`}>{n.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-slate-200 text-sm">{n.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{n.desc}</div>
                  <div className="text-[10px] text-slate-500 mt-2">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-[#151821] border border-[#2A2E3D] rounded-2xl p-6">
          <h2 className="text-red-500 font-bold mb-4 flex items-center gap-2">
            <span>🚨</span> Emergency Contacts
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs text-slate-500">Daycare Hotline</div>
              <div className="font-bold text-red-500 mt-0.5">+1 (555) 987-6543</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">24/7 Support</div>
              <div className="font-bold text-red-500 mt-0.5">+1 (800) 123-4567</div>
            </div>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition text-sm">
            Emergency Alert
          </button>
        </div>

      </div>
    </div>
  );
}
