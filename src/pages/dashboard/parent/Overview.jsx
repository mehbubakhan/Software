import React from 'react'
import { Link } from 'react-router-dom'

export default function Overview() {
  const stats = [
    { value: '2', label: 'Nanny Bookings', color: 'text-green-400', bg: 'bg-green-400/20', icon: '👩‍🍼' },
    { value: '5', label: 'Messages', color: 'text-pink-400', bg: 'bg-pink-400/20', icon: '✉️' },
    { value: '12', label: 'Daycares', color: 'text-green-400', bg: 'bg-green-400/20', icon: '🏫' },
    { value: '8', label: 'Marketplaces', color: 'text-blue-400', bg: 'bg-blue-400/20', icon: '🛍️' },
    { value: '1', label: 'Edu Programs', color: 'text-blue-400', bg: 'bg-blue-400/20', icon: '📚' },
    { value: '1', label: 'Adoption tickets', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: '🎫' },
    { value: '2', label: 'Pending Orders', color: 'text-pink-400', bg: 'bg-pink-400/20', icon: '📦' },
    { value: '45%', label: 'Completed Tasks', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: '✅' },
  ]

  const quickActions = [
    { label: 'Find Nanny', desc: 'Browse rated nannies', bg: 'bg-fuchsia-600', icon: '👩‍🍼', path: '/dashboard/parent/hire-nanny' },
    { label: 'Browse Daycare', desc: 'Explore trusted centers', bg: 'bg-green-600', icon: '🏫', path: '/dashboard/parent/daycare' },
    { label: 'Shop Products', desc: 'Baby care essentials', bg: 'bg-orange-500', icon: '🛍️', path: '/dashboard/parent/marketplace' },
    { label: 'Orphanage', desc: 'Adoption profiles', bg: 'bg-blue-600', icon: '👶', path: '/dashboard/parent/adoption' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="bg-[#1A1D27] rounded-3xl p-8 text-center border border-[#2A2E3D] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-fuchsia-600/10 to-blue-600/10 pointer-events-none"></div>
        <h1 className="text-3xl font-bold text-white relative z-10 flex items-center justify-center gap-3">
          <span className="text-4xl">👋</span> Welcome back, Sarah!
        </h1>
        <p className="text-slate-400 mt-2 relative z-10">Here's what's happening with your children today</p>
      </div>

      {/* Child Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Md Reza', age: '2 mos old', avatar: '👶', link: '/dashboard/parent/child-profile' },
          { name: 'Emma White', age: '4 yrs old', avatar: '👧', link: '/dashboard/parent/child-profile' }
        ].map((child, idx) => (
          <div key={idx} className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5 hover:border-fuchsia-500/50 transition">
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-[#2A2E3D]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl border-2 border-fuchsia-500">
                  {child.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{child.name}</h3>
                  <p className="text-sm text-slate-400">{child.age}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">♡</button>
            </div>
            
            <div className="space-y-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">🏫</div>
                <div>
                  <p className="text-sm font-semibold text-white">Parent Module</p>
                  <p className="text-xs text-slate-400">Sunshine Daycare</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">🚌</div>
                <div>
                  <p className="text-sm font-semibold text-white">In-Transit</p>
                  <p className="text-xs text-slate-400">04:30 PM - 05:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">💉</div>
                <div>
                  <p className="text-sm font-semibold text-white">Health & Growth</p>
                  <p className="text-xs text-slate-400">All vaccinations up to date</p>
                </div>
              </div>
            </div>

            <Link to={child.link} className="block w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl text-center transition">
              View full Profile
            </Link>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#1A1D27] border border-[#2A2E3D] rounded-2xl p-4 flex flex-col justify-between">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Nanny Bookings */}
          <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Nanny Bookings</h3>
              <a href="#" className="text-xs text-slate-400 hover:text-white">See All</a>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">👩</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Maria Rodriguez</p>
                    <p className="text-xs text-slate-400">Oct 12, 2024 • 09:00 - 18:00</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Confirmed</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">👩‍🦰</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Sarah Johnson</p>
                    <p className="text-xs text-slate-400">Oct 14, 2024 • 14:00 - 19:00</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Pending</span>
              </div>
            </div>
          </div>

          {/* Daycare Updates */}
          <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Daycare Updates</h3>
              <a href="#" className="text-xs text-slate-400 hover:text-white">See All</a>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">🍽️</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Lunch & Nap Time</p>
                    <p className="text-xs text-slate-400">Sunshine Daycare</p>
                  </div>
                </div>
                <span className="text-slate-500">›</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">🎨</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Art Activity Session</p>
                    <p className="text-xs text-slate-400">Little Stars Center</p>
                  </div>
                </div>
                <span className="text-slate-500">›</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Upcoming Schedule</h3>
              <a href="#" className="text-xs text-slate-400 hover:text-white">See Calendar</a>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">🏥</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Pediatrician Appt - Month Checkup</p>
                    <p className="text-xs text-slate-400 mt-1">Oct 15, 2024 • 10:30 AM</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><span>📍</span> Local Hospital</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">🤝</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Orphanage Meetup Meeting</p>
                    <p className="text-xs text-slate-400 mt-1">Oct 18, 2024 • 2:00 PM</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><span>📍</span> Downtown Center</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-[#2A2E3D] hover:bg-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">💉</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Vaccination Schedule</p>
                    <p className="text-xs text-slate-400 mt-1">Oct 20, 2024 • 9:00 AM</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><span>📍</span> City Clinic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Recent Orders</h3>
              <a href="#" className="text-xs text-slate-400 hover:text-white">See All</a>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#2A2E3D]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Delivered</span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">Baby Stroller - Premium</p>
                  <p className="text-xs text-slate-400">Oct 5, 2024</p>
                </div>
                <span className="font-bold text-white">$250.00</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#2A2E3D]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">In Transit</span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">Organic Baby Food (6pk)</p>
                  <p className="text-xs text-slate-400">Oct 8, 2024</p>
                </div>
                <span className="font-bold text-white">$35.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link key={idx} to={action.path} className={`${action.bg} rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-1 transition duration-300 shadow-lg`}>
            <div className="text-3xl mb-4 bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
              {action.icon}
            </div>
            <div>
              <p className="font-bold text-white mb-1">{action.label}</p>
              <p className="text-xs text-white/80">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Wishlist */}
      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white">Wishlist</h3>
          <button className="text-slate-400 hover:text-white">♡</button>
        </div>
        <div className="space-y-2">
          {['Toys (12 items)', 'Shoes (3 items)', 'Books (8 items)', 'Health (5 items)'].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 cursor-pointer border-b border-[#2A2E3D] last:border-0">
              <span className="text-sm text-slate-300">{item}</span>
              <span className="w-6 h-6 rounded-full bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center text-xs">›</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
