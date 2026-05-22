import React, { useState } from 'react'

export default function ChildProfile() {
  const [activeTab, setActiveTab] = useState('Overview')

  const tabs = ['Overview', 'Weekly Progress', 'Schedule', 'Health & Growth']

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-fuchsia-600 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>👩‍🍼</span>
            <span className="text-2xl font-bold text-white">3/3</span>
          </div>
          <p className="text-sm font-semibold text-white">Nanny Bookings</p>
        </div>
        <div className="bg-fuchsia-500 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>⏱️</span>
            <span className="text-2xl font-bold text-white">2.5 hrs</span>
          </div>
          <p className="text-sm font-semibold text-white">Real-Time Today</p>
        </div>
        <div className="bg-green-500 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>📅</span>
            <span className="text-2xl font-bold text-white">5</span>
          </div>
          <p className="text-sm font-semibold text-white">Appointments</p>
        </div>
        <div className="bg-orange-500 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>📚</span>
            <span className="text-2xl font-bold text-white">3</span>
          </div>
          <p className="text-sm font-semibold text-white">Learning Session</p>
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white">Recent Activities</h3>
          <a href="#" className="text-xs text-slate-400 hover:text-white">View All</a>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">🥗</div>
              <div>
                <p className="text-sm font-semibold text-white">Nutrition Plan</p>
                <p className="text-xs text-slate-400">1 hour ago</p>
              </div>
            </div>
            <span className="text-green-500">✓</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">➕</div>
              <div>
                <p className="text-sm font-semibold text-white">Math Class - Finger Painting</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
            <span className="text-green-500">✓</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">🔤</div>
              <div>
                <p className="text-sm font-semibold text-white">Alphabet Learning</p>
                <p className="text-xs text-slate-400">4 hours ago</p>
              </div>
            </div>
            <span className="text-green-500">✓</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center">🥪</div>
              <div>
                <p className="text-sm font-semibold text-white">Morning Snack</p>
                <p className="text-xs text-slate-400">5 hours ago</p>
              </div>
            </div>
            <span className="text-green-500">✓</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="font-bold text-white">Live Daycare Updates</h3>
        </div>
        <div className="p-4 rounded-xl border border-[#2A2E3D] bg-blue-500/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">👩‍🏫</div>
            <div>
              <p className="text-sm font-semibold text-blue-400">Teacher Update</p>
              <p className="text-sm text-slate-300 mt-1">Md Reza is engaged in art class today. Very creative with colors.</p>
              <p className="text-xs text-slate-500 mt-2">2 mins ago</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-4 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl text-center transition">
          View Live CCTV Feed
        </button>
      </div>
    </div>
  )

  const renderWeeklyProgress = () => (
    <div className="space-y-6">
      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-6">Weekly Activity Overview</h3>
        {/* CSS Chart Simulation */}
        <div className="relative h-48 w-full border-b border-l border-[#2A2E3D] pb-6 pl-4 flex items-end justify-between">
          {/* Grid lines */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none pb-6 pl-4">
            <div className="w-full border-t border-[#2A2E3D] opacity-50"></div>
            <div className="w-full border-t border-[#2A2E3D] opacity-50"></div>
            <div className="w-full border-t border-[#2A2E3D] opacity-50"></div>
          </div>
          
          {/* Data Points */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={day} className="flex flex-col items-center flex-1 z-10">
              <div className="relative w-full h-32 flex justify-center items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 absolute" style={{ bottom: `${40 + (i % 2 === 0 ? 20 : 0)}%` }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 absolute" style={{ bottom: `${60 + (i % 3 === 0 ? -10 : 10)}%` }}></div>
                <div className="w-2 h-2 rounded-full bg-fuchsia-400 absolute" style={{ bottom: `${30 + (i * 10)}%` }}></div>
              </div>
              <span className="text-xs text-slate-400 mt-2">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-6">Learning Progress</h3>
        <div className="space-y-5">
          {[
            { label: 'Alphabet', percent: 72 },
            { label: 'Numbers', percent: 84 },
            { label: 'Colors', percent: 60 },
            { label: 'Shapes', percent: 92 },
            { label: 'Phonics', percent: 55 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">{item.label}</span>
                <span className="text-slate-400">{item.percent}%</span>
              </div>
              <div className="w-full bg-[#2A2E3D] rounded-full h-2 overflow-hidden">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-8 h-8 bg-orange-500/20 text-orange-400 rounded flex items-center justify-center">🎓</div>
          <span className="text-2xl font-bold text-white">41</span>
          <span className="text-xs text-slate-400">Total Sessions</span>
        </div>
        <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded flex items-center justify-center">⏱️</div>
          <span className="text-2xl font-bold text-white">23</span>
          <span className="text-xs text-slate-400">Learning Hours</span>
        </div>
        <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded flex items-center justify-center">🌡️</div>
          <span className="text-2xl font-bold text-white">3.1 hrs</span>
          <span className="text-xs text-slate-400">Avg Temp</span>
        </div>
      </div>
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-4">Upcoming This Week</h3>
        <div className="space-y-3">
          {[
            { label: 'Art Class', location: 'Sunshine Daycare', date: 'Tomorrow', time: '10:00 AM', icon: '🎨', color: 'text-purple-400', bg: 'bg-purple-500/20' },
            { label: 'Music & Movement', location: 'Sunshine Daycare', date: 'Feb 20', time: '11:00 AM', icon: '🎵', color: 'text-blue-400', bg: 'bg-blue-500/20' },
            { label: 'Pediatric Checkup', location: 'City Hospital', date: 'Feb 22', time: '09:30 AM', icon: '🏥', color: 'text-green-400', bg: 'bg-green-500/20' },
            { label: 'Storytelling Session', location: 'Sunshine Daycare', date: 'Feb 24', time: '02:00 PM', icon: '📚', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20' },
            { label: 'Outdoor Play Date', location: 'Central Park', date: 'Feb 25', time: '03:00 PM', icon: '🏃', color: 'text-orange-400', bg: 'bg-orange-500/20' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-lg flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-300">{item.date}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-4">Daily Routine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { time: '8:00 AM', label: 'Breakfast & Morning Circle', icon: '🥣' },
            { time: '10:00 AM', label: 'Learning Activities', icon: '🖍️' },
            { time: '12:00 PM', label: 'Lunch Time', icon: '🍽️' },
            { time: '1:00 PM', label: 'Nap Time', icon: '😴' },
            { time: '3:00 PM', label: 'Outdoor Play', icon: '🏃‍♂️' },
            { time: '4:00 PM', label: 'Art & Creativity', icon: '🎨' },
            { time: '5:00 PM', label: 'Pick up Time', icon: '🚗' },
          ].map((routine, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-[#2A2E3D] bg-white/5">
              <div className="text-xl">{routine.icon}</div>
              <div>
                <p className="text-sm font-semibold text-white">{routine.label}</p>
                <p className="text-xs text-slate-400">{routine.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderHealth = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-600 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>🛡️</span>
            <span className="text-lg font-bold text-white">Vaccinations</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Up to date</p>
            <p className="text-xs text-white/80">Next: MMR Booster in 2 months</p>
          </div>
        </div>
        <div className="bg-blue-600 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>📏</span>
            <span className="text-lg font-bold text-white">Height</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">97 cm</p>
            <p className="text-xs text-white/80">75th percentile</p>
          </div>
        </div>
        <div className="bg-purple-600 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <span>⚖️</span>
            <span className="text-lg font-bold text-white">Weight</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">12.5 kg</p>
            <p className="text-xs text-white/80">65th percentile</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-6">Growth Tracking</h3>
        <div className="relative h-48 w-full border-b border-l border-[#2A2E3D] pb-6 pl-4 flex items-end justify-between">
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none pb-6 pl-4">
            <div className="w-full border-t border-[#2A2E3D] opacity-50"></div>
            <div className="w-full border-t border-[#2A2E3D] opacity-50"></div>
            <div className="w-full border-t border-[#2A2E3D] opacity-50"></div>
          </div>
          
          {['Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, i) => (
            <div key={month} className="flex flex-col items-center flex-1 z-10 h-full justify-end">
              <div className="flex items-end gap-1 w-full justify-center h-full">
                <div className="w-3 bg-fuchsia-500 rounded-t-sm" style={{ height: `${20 + (i * 5)}%` }}></div>
                <div className="w-6 bg-blue-500 rounded-t-sm" style={{ height: `${60 + (i * 6)}%` }}></div>
              </div>
              <span className="text-xs text-slate-400 mt-2">{month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-4">Upcoming Health Events</h3>
        <div className="space-y-3">
          {[
            { label: 'Medical Checkup', date: 'May 10, 2026', icon: '🩺' },
            { label: 'Dental Checkup', date: 'July 1, 2026', icon: '🦷' },
            { label: 'MMR Booster Vaccination', date: 'July 15, 2026', icon: '💉' },
          ].map((event, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center shrink-0">
                  {event.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{event.label}</p>
                  <p className="text-xs text-slate-400">{event.date}</p>
                </div>
              </div>
              <span className="text-green-500">↓</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <h3 className="font-bold text-white mb-4">Medical Notes</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-[#2A2E3D] bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-500">⚠️</span>
              <p className="text-sm font-semibold text-white">Allergies</p>
            </div>
            <p className="text-xs text-slate-400 ml-6">Peanuts, lactose</p>
          </div>
          <div className="p-4 rounded-xl border border-[#2A2E3D] bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500">🩸</span>
              <p className="text-sm font-semibold text-white">Blood Type</p>
            </div>
            <p className="text-xs text-slate-400 ml-6">A+</p>
          </div>
          <div className="p-4 rounded-xl border border-[#2A2E3D] bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-500">📝</span>
              <p className="text-sm font-semibold text-white">Notes</p>
            </div>
            <p className="text-xs text-slate-400 ml-6">Predisposed asthmatic tendencies in cold weather (unconfirmed, track closely).</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Child Profile</h1>
        <p className="text-sm text-slate-500">Monitor your child's growth, activities, and development</p>
      </div>

      {/* Profile Header */}
      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl border-2 border-fuchsia-500">
            👶
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Md Reza</h2>
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">Level 28</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-[#2A2E3D] bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">🏫</div>
            <div>
              <p className="text-sm font-semibold text-white">Parent Module</p>
              <p className="text-xs text-slate-400 mt-1">Sunshine Daycare</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl border border-[#2A2E3D] bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">💉</div>
            <div>
              <p className="text-sm font-semibold text-white">Health Status</p>
              <p className="text-xs text-slate-400 mt-1">All vaccinations up to date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-[#2A2E3D] overflow-x-auto pb-px">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === tab
                ? 'border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-t-lg'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Weekly Progress' && renderWeeklyProgress()}
        {activeTab === 'Schedule' && renderSchedule()}
        {activeTab === 'Health & Growth' && renderHealth()}
      </div>
    </div>
  )
}
