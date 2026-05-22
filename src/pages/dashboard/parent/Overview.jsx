import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Overview() {
  const [stats, setStats] = useState({
    childSafetyStatus: 'Safe',
    activeNanny: true,
    pendingNotifications: 3,
    upcomingEvents: 1,
  })
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Fetch parent dashboard data
    const fetchData = async () => {
      try {
        const response = await api.get('/parent/overview')
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching overview:', error)
      }
    }
    fetchData()
  }, [])

  const quickActions = [
    { icon: '👩‍🍼', label: 'Hire Nanny', path: '/dashboard/parent/hire-nanny' },
    { icon: '🏫', label: 'Find Daycare', path: '/dashboard/parent/daycare' },
    { icon: '🚨', label: 'Emergency SOS', path: '/dashboard/parent/sos' },
    { icon: '📍', label: 'Track Child', path: '/dashboard/parent/gps' },
    { icon: '🛍', label: 'Shop Products', path: '/dashboard/parent/marketplace' },
    { icon: '📊', label: 'View Reports', path: '/dashboard/parent/reports' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Parent Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's your family's overview</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Child Safety</p>
              <p className="text-2xl font-bold text-green-600">✓ {stats.childSafetyStatus}</p>
            </div>
            <span className="text-3xl">🛡️</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Nanny Status</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeNanny ? 'Active' : 'None'}</p>
            </div>
            <span className="text-3xl">👩‍🍼</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Notifications</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingNotifications}</p>
            </div>
            <span className="text-3xl">🔔</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-purple-600">{stats.upcomingEvents}</p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => (
            <a
              key={idx}
              href={action.path}
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg hover:border-fuchsia-500 hover:shadow-lg transition"
            >
              <span className="text-3xl mb-2">{action.icon}</span>
              <span className="text-xs font-semibold text-center text-slate-600">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-semibold text-slate-900">Child Location Updated</p>
              <p className="text-sm text-slate-600">Your child is safe at daycare</p>
            </div>
            <span className="text-xs text-slate-500 ml-auto">5 mins ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-xl">🍽️</span>
            <div>
              <p className="font-semibold text-slate-900">Meal Update</p>
              <p className="text-sm text-slate-600">Lunch finished successfully</p>
            </div>
            <span className="text-xs text-slate-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
