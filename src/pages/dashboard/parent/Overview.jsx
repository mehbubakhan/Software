import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'
import { useSocket } from '../../../context/SocketContext'
import AddChildModal from './components/AddChildModal'

export default function Overview() {
  const { user } = useAuth()
  const { notifications: rawNotifications, markNotificationRead } = useSocket() || { notifications: [] }
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedWishlist, setExpandedWishlist] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showAddChild, setShowAddChild] = useState(false)
  const [editingChild, setEditingChild] = useState(null)
  const navigate = useNavigate()

  const notifications = Array.from(new Map(rawNotifications.map(item => [item.id, item])).values())
    .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const fetchOverview = async () => {
    try {
      const res = await api.get('/dashboard/parent/overview')
      if (res.data && res.data.ok) {
        setData(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch parent overview or notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  if (loading) {
    return <div className="text-slate-900 text-center py-20">Loading dashboard data...</div>
  }

  if (!data) {
    return <div className="text-red-400 text-center py-20">Failed to load data. Please ensure backend is running.</div>
  }

  const { children, stats, nannyBookings, daycareUpdates, upcomingSchedule, recentActivities, recentOrders } = data
  
  // Use real notifications count if available
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const displayNotifCount = notifications.length > 0 ? unreadCount : stats.notifications;

  const statCards = [
    { value: stats.activeBookings, label: 'Active Bookings', color: 'text-green-400', bg: 'bg-green-400/20', icon: '👩‍🍼' },
    { value: stats.messages, label: 'Messages', color: 'text-pink-400', bg: 'bg-pink-400/20', icon: '✉️' },
    { value: displayNotifCount, label: 'Notifications', color: 'text-green-400', bg: 'bg-green-400/20', icon: '🔔' },
    { value: stats.weeklyHours, label: 'Weekly Hours', color: 'text-blue-400', bg: 'bg-blue-400/20', icon: '⏱️' },
    { value: stats.nanniesHired, label: 'Nannies Hired', color: 'text-blue-400', bg: 'bg-blue-400/20', icon: '👤' },
    { value: stats.daycareAdmins, label: 'Daycare Admins', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: '📁' },
    { value: stats.pendingOrders, label: 'Pending Orders', color: 'text-pink-400', bg: 'bg-pink-400/20', icon: '📦' },
    { value: stats.completionOrders + '%', label: 'Completion Orders', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: '🎓' },
  ]

  const quickActions = [
    { label: 'Find Nanny', desc: 'Browse rated nannies', bg: 'bg-blue-600', icon: '👩‍🍼', path: '/dashboard/parent/hire-nanny' },
    { label: 'Browse Daycare', desc: 'Explore trusted centers', bg: 'bg-green-600', icon: '🏫', path: '/dashboard/parent/daycare' },
    { label: 'Shop Products', desc: 'Baby care essentials', bg: 'bg-orange-500', icon: '🛍️', path: '/dashboard/parent/marketplace' },
    { label: 'Orphanage', desc: 'Adoption profiles', bg: 'bg-blue-600', icon: '👶', path: '/dashboard/parent/adoption' },
  ]

  const wishlistItems = [
    { title: 'Saved Nannies (2)', items: [{ name: 'Kamrun Nahar', path: '/dashboard/parent/hire-nanny/1' }, { name: 'Aisha Khan', path: '/dashboard/parent/hire-nanny/2' }] },
    { title: 'Saved Daycares (4)', items: [{ name: 'Happy Kids Daycare', path: '/dashboard/parent/daycare' }, { name: 'Sunny Days Center', path: '/dashboard/parent/daycare' }, { name: 'Little Angels', path: '/dashboard/parent/daycare' }, { name: 'Tiny Tots', path: '/dashboard/parent/daycare' }] },
    { title: 'Saved Videos (5)', items: [{ name: 'Childcare Tips', path: '#' }, { name: 'Healthy Recipes', path: '#' }, { name: 'Activity Ideas', path: '#' }, { name: 'Potty Training', path: '#' }, { name: 'Sleep Training', path: '#' }] },
    { title: 'Saved Products (8)', items: [{ name: 'Baby Monitor', path: '#' }, { name: 'Stroller', path: '#' }, { name: 'Educational Toys', path: '#' }, { name: 'Diapers', path: '#' }] },
  ]
  
  const handleStatClick = (label) => {
    if (label === 'Messages') setShowMessageModal(true);
    if (label === 'Notifications') setShowNotificationModal(true);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-fuchsia-600/10 to-pink-600/10 pointer-events-none"></div>
        <div className="relative z-10 mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl">✨</span> Welcome back, {user?.name || data.user.name}!
          </h1>
          <p className="text-slate-500 mt-2">Here's what's happening with your children today</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/child')}
          className="relative z-10 shrink-0 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-500 px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(192,38,211,0.5)] transition hover:scale-105 hover:shadow-[0_0_30px_rgba(192,38,211,0.7)] flex flex-col items-center gap-1"
        >
          <span className="text-2xl">🎮</span>
          <span className="tracking-wide">ENTER CHILD MODE</span>
        </button>
      </div>

      {/* Child Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-fuchsia-50 rounded-full flex items-center justify-center text-2xl border-2 border-fuchsia-500">
                  {idx % 2 === 0 ? '🧒' : '👧'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{child.name}</h3>
                  <p className="text-sm text-slate-500">{child.age}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingChild(child)
                    setShowAddChild(true)
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-fuchsia-600 hover:bg-slate-200 transition"
                  title="Edit Profile"
                >
                  ✏️
                </button>
                <button className="text-slate-500 hover:text-slate-900">♡</button>
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">🏫</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Current Daycare</p>
                  <p className="text-xs text-slate-500">{child.currentDaycare}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">🚌</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Next Activity</p>
                  <p className="text-xs text-slate-500">{child.nextActivity}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">💉</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Health Status</p>
                  <p className="text-xs text-slate-500">{child.healthStatus}</p>
                </div>
              </div>
            </div>

            <Link to={`/dashboard/parent/child-profile/${child.id}`} className="block w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl text-center transition shadow-sm">
              View full Profile
            </Link>
          </div>
        ))}
        
        {/* Add Child Card */}
        <div 
          onClick={() => {
            setEditingChild(null)
            setShowAddChild(true)
          }}
          className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-5 hover:border-fuchsia-500/50 hover:bg-fuchsia-50/50 transition cursor-pointer flex flex-col items-center justify-center min-h-[250px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-3xl mb-4 text-fuchsia-500">
            +
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Add Another Child</h3>
          <p className="text-slate-500 text-sm text-center mt-2 max-w-[200px]">
            Add a child to track their activities and connect with nannies.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => handleStatClick(stat.label)}
            className={`bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between ${(stat.label === 'Messages' || stat.label === 'Notifications') ? 'cursor-pointer hover:border-pink-500/50 transition' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Nanny Bookings */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Nanny Bookings</h3>
              <a href="#" className="text-xs text-slate-500 hover:text-slate-900">View All</a>
            </div>
            <div className="space-y-3">
              {nannyBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-200 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center text-xl">👩</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{booking.name}</p>
                      <p className="text-xs text-slate-500">{booking.date} • {booking.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daycare Updates */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Daycare Updates</h3>
              <a href="#" className="text-xs text-slate-500 hover:text-slate-900">View All</a>
            </div>
            <div className="space-y-3">
              {daycareUpdates.map((update) => (
                <div key={update.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${update.color}-500/20 text-${update.color}-400 flex items-center justify-center`}>{update.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{update.title}</p>
                      <p className="text-xs text-slate-500">{update.location}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{update.time}</p>
                    </div>
                  </div>
                  <span className="text-slate-500">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Recent Activities</h3>
              <a href="#" className="text-xs text-slate-500 hover:text-slate-900">See All</a>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-50 flex items-center justify-center shrink-0 border border-fuchsia-100">{activity.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activity.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Upcoming Schedule</h3>
              <Link to="/dashboard/parent/schedule" className="text-xs text-slate-500 hover:text-slate-900">View Calendar</Link>
            </div>
            <div className="space-y-3">
              {upcomingSchedule.map((schedule) => (
                <div key={schedule.id} className="p-3 rounded-xl border border-slate-200 hover:bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${schedule.color}-500/20 text-${schedule.color}-400 flex items-center justify-center shrink-0`}>{schedule.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{schedule.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{schedule.date}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><span>📍</span> {schedule.location}</p>
                    </div>
                    <span className="text-slate-500">›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <a href="#" className="text-xs text-slate-500 hover:text-slate-900">View All</a>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{order.orderId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{order.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{order.item}</p>
                    <p className="text-xs text-slate-500">{order.date}</p>
                  </div>
                  <span className="font-bold text-slate-900">{order.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {quickActions.map((action, idx) => (
          <Link key={idx} to={action.path} className={`${action.bg.replace('blue', 'fuchsia')} rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-1 transition duration-300 shadow-sm border border-slate-200 bg-white`}>
            <div className="text-3xl mb-4 bg-fuchsia-50 w-12 h-12 rounded-full flex items-center justify-center text-fuchsia-600">
              {action.icon}
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-1">{action.label}</p>
              <p className="text-xs text-slate-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Wishlist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">Wishlist</h3>
          <button className="text-slate-500 hover:text-slate-900">♡</button>
        </div>
        <div className="space-y-2">
          {wishlistItems.map((category, idx) => (
            <div key={idx} className="border-b border-slate-200 last:border-0">
              <div
                onClick={() => setExpandedWishlist(expandedWishlist === idx ? null : idx)}
                className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 cursor-pointer"
              >
                <span className="text-sm text-slate-600">{category.title}</span>
                <span className={`w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-xs transition-transform ${expandedWishlist === idx ? 'rotate-90' : ''}`}>›</span>
              </div>
              {expandedWishlist === idx && (
                <div className="pl-6 pb-3 space-y-2">
                  {category.items.map((item, i) => (
                    <Link key={i} to={item.path} className="text-xs text-slate-500 hover:text-fuchsia-600 transition cursor-pointer py-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"></span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden flex flex-col h-[500px]">
            <div className="bg-fuchsia-50 p-4 flex justify-between items-center border-b border-fuchsia-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><span>✉️</span> Messages</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-500 hover:text-fuchsia-600">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">KN</div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm text-slate-700">Hi! I am available for an interview tomorrow.</p>
                  <p className="text-[10px] text-slate-400 mt-1">10:00 AM</p>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="bg-fuchsia-600 rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm text-white">Great! Let's schedule it for 2 PM.</p>
                  <p className="text-[10px] text-fuchsia-200 mt-1">10:05 AM</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 bg-white border border-slate-200 rounded-full px-4 text-sm text-slate-900 focus:outline-none focus:border-fuchsia-500" />
              <button className="w-10 h-10 rounded-full bg-fuchsia-600 text-white flex items-center justify-center hover:bg-fuchsia-700 transition">↑</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden flex flex-col h-[500px]">
            <div className="bg-fuchsia-50 p-4 flex justify-between items-center border-b border-fuchsia-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><span>🔔</span> Notifications</h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-500 hover:text-fuchsia-600">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No new notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => !notif.is_read && markNotificationRead(notif.id, notif.source)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${notif.is_read ? 'bg-slate-50 border-slate-100' : 'bg-white border-fuchsia-200 shadow-sm'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                      {!notif.is_read && <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span>}
                    </div>
                    <p className={`text-xs mt-1 ${notif.is_read ? 'text-slate-500' : 'text-slate-700'}`}>{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(notif.created_at).toLocaleString()} • {notif.sender_role}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Child Modal */}
      <AddChildModal 
        isOpen={showAddChild} 
        initialData={editingChild}
        onClose={() => {
          setShowAddChild(false)
          setEditingChild(null)
        }} 
        onSuccess={fetchOverview} 
      />

    </div>
  )
}

