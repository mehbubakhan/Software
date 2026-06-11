import React, { useState } from 'react'
import api from '../../../services/api'

export default function Reports() {
  const [activeTab, setActiveTab] = useState('activity')
  const [dateRange, setDateRange] = useState('week')

  const activityReports = [
    {
      date: 'Today',
      activities: [
        { time: '09:00 AM', activity: 'Arrival at Daycare', detail: 'Happy and energetic', icon: '📍' },
        { time: '10:30 AM', activity: 'Breakfast', detail: 'Consumed cereal and juice', icon: '🍽️' },
        { time: '01:00 PM', activity: 'Nap Time', detail: 'Slept for 1.5 hours', icon: '😴' },
        { time: '03:00 PM', activity: 'Play Time', detail: 'Played with blocks and toys', icon: '🎮' },
        { time: '04:30 PM', activity: 'Pickup', detail: 'Ready to go home', icon: '🚗' },
      ]
    }
  ]

  const expenseData = [
    { category: 'Daycare', monthly: 1200, spent: 1200, percentage: 100 },
    { category: 'Nanny', monthly: 800, spent: 800, percentage: 100 },
    { category: 'Products', monthly: 300, spent: 150, percentage: 50 },
    { category: 'Education', monthly: 200, spent: 200, percentage: 100 },
    { category: 'Healthcare', monthly: 100, spent: 50, percentage: 50 },
  ]

  const safetyMetrics = [
    { metric: 'Total Alerts', value: 12, status: 'Normal' },
    { metric: 'Safety Incidents', value: 0, status: 'Good' },
    { metric: 'Left Geofence', value: 3, status: 'Tracked' },
    { metric: 'Emergency SOS', value: 0, status: 'Good' },
  ]

  const totalMonthlyBudget = expenseData.reduce((sum, item) => sum + item.monthly, 0)
  const totalSpent = expenseData.reduce((sum, item) => sum + item.spent, 0)

  const downloadReport = async (type) => {
    try {
      await api.get(`/reports/download?type=${type}`)
      alert(`${type} report downloaded successfully!`)
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-2">Track activities, expenses, and safety</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'activity'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 Activity Reports
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'expenses'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💰 Expense Tracking
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'safety'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🛡️ Safety Analytics
        </button>
      </div>

      {/* Activity Reports Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {activityReports.map((report, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{report.date}</h3>
              <div className="space-y-3">
                {report.activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="text-3xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900">{activity.activity}</h4>
                        <span className="text-sm text-slate-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-slate-600">{activity.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => downloadReport('activity')}
            className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
          >
            📥 Download Activity Report (PDF)
          </button>
        </div>
      )}

      {/* Expense Tracking Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Monthly Budget</p>
              <p className="text-3xl font-bold text-green-600">${totalMonthlyBudget}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Total Spent</p>
              <p className="text-3xl font-bold text-blue-600">${totalSpent}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Remaining</p>
              <p className="text-3xl font-bold text-purple-600">${totalMonthlyBudget - totalSpent}</p>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Expense Breakdown</h3>
            <div className="space-y-3">
              {expenseData.map((expense, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{expense.category}</span>
                    <span className="text-slate-600">${expense.spent} / ${expense.monthly}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-fuchsia-600 h-2 rounded-full transition"
                      style={{ width: `${expense.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-4">Monthly Trend</h4>
              <div className="h-40 flex items-end justify-around gap-2">
                {[65, 78, 72, 85, 90, 82, 88].map((height, idx) => (
                  <div key={idx} className="w-8 bg-gradient-to-t from-fuchsia-600 to-pink-500 rounded" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-4">Category Distribution</h4>
              <div className="space-y-2">
                {expenseData.map((expense, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{expense.category}</span>
                    <span className="font-semibold">{Math.round((expense.spent / totalSpent) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => downloadReport('expense')}
            className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
          >
            📥 Download Expense Report (CSV)
          </button>
        </div>
      )}

      {/* Safety Analytics Tab */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          {/* Safety Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {safetyMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-600 mb-2">{metric.metric}</p>
                <p className="text-3xl font-bold text-fuchsia-600">{metric.value}</p>
                <p className="text-xs text-slate-500 mt-1">{metric.status}</p>
              </div>
            ))}
          </div>

          {/* Alert History */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Safety Events</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <span className="text-xl">✓</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Child checked in at Daycare</p>
                  <p className="text-sm text-slate-600">Today at 09:15 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Left geofence zone temporarily</p>
                  <p className="text-sm text-slate-600">Yesterday at 02:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <span className="text-xl">ℹ️</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">GPS signal strong</p>
                  <p className="text-sm text-slate-600">Continuous tracking active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Geofence Statistics */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Safe Zone Analytics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="font-semibold text-slate-900">Home</span>
                <span className="text-sm text-slate-600">8 hours daily</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="font-semibold text-slate-900">Daycare</span>
                <span className="text-sm text-slate-600">6 hours daily</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="font-semibold text-slate-900">School</span>
                <span className="text-sm text-slate-600">4 hours daily</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => downloadReport('safety')}
            className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
          >
            📥 Download Safety Report (PDF)
          </button>
        </div>
      )}
    </div>
  )
}

