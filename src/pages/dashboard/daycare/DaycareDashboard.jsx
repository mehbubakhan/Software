import React, { useState, useEffect } from 'react';

export default function DaycareDashboard() {
  const [stats, setStats] = useState({
    activeChildren: 42,
    pendingApprovals: 5,
    staffCount: 16,
    todaysBookings: 24,
    revenueMonth: 12400
  });

  const recentRequests = [
    { id: 1, childName: 'Emma', parentName: 'Sarah Johnson', date: '2026-05-25', time: '8:00 AM', status: 'pending' },
    { id: 2, childName: 'Oliver', parentName: 'Michael Brown', date: '2026-05-25', time: '7:30 AM', status: 'approved' },
    { id: 3, childName: 'Sophia', parentName: 'Jessica Lee', date: '2026-05-26', time: '9:00 AM', status: 'pending' }
  ];

  const schedule = [
    { time: '8:00 AM', title: 'Morning Drop-off', count: 15 },
    { time: '9:30 AM', title: 'Breakfast Time', count: 42 },
    { time: '10:30 AM', title: 'Outdoor Play', count: 38 },
    { time: '12:00 PM', title: 'Lunch Time', count: 42 },
    { time: '1:00 PM', title: 'Nap Time', count: 35 },
    { time: '3:00 PM', title: 'Snack & Activities', count: 40 },
    { time: '5:00 PM', title: 'Pickup Time', count: 18 }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 text-slate-800">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">Today's Bookings</p>
            <p className="text-2xl font-bold">{stats.todaysBookings}</p>
          </div>
          <div className="bg-blue-50 text-blue-500 p-3 rounded-lg">📅</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">Active Children</p>
            <p className="text-2xl font-bold">{stats.activeChildren}</p>
          </div>
          <div className="bg-purple-50 text-purple-500 p-3 rounded-lg">👥</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">Pending Approvals</p>
            <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
          </div>
          <div className="bg-amber-50 text-amber-500 p-3 rounded-lg">⏱️</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">Revenue (Month)</p>
            <p className="text-2xl font-bold">${stats.revenueMonth.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 text-green-500 p-3 rounded-lg">💲</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h2 className="font-bold text-lg">Recent Booking Requests</h2>
            <button className="text-purple-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="p-0">
            {recentRequests.map(req => (
              <div key={req.id} className="flex justify-between items-center p-6 border-b border-slate-50 hover:bg-slate-50 transition">
                <div>
                  <h3 className="font-bold text-md">{req.childName} <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{req.status}</span></h3>
                  <p className="text-xs text-slate-500 mt-1">Parent: {req.parentName}</p>
                  <p className="text-xs text-slate-500">Date: {req.date} • Time: {req.time}</p>
                </div>
                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition">Approve</button>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg">Today's Schedule</h2>
            <span className="text-xs text-slate-400">January 22, 2026</span>
          </div>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {schedule.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-slate-300 group-hover:bg-purple-500 text-slate-500 group-hover:text-purple-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors"></div>
                <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-100 shadow-sm bg-white">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                  </div>
                  <div className="text-xs text-purple-600 mt-1 font-medium">{item.count} children</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 text-xs mb-1">Occupancy Rate</h3>
            <div className="text-3xl font-bold text-purple-600">84%</div>
            <p className="text-xs text-slate-400 mt-1">42 of 50 capacity</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-purple-500 flex items-center justify-center">
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-xs mb-1">Staff on Duty</h3>
          <div className="text-3xl font-bold">{stats.staffCount}</div>
          <p className="text-xs text-slate-400 mt-1">8 Teachers, 4 Assistants</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 text-xs mb-1">Avg. Rating</h3>
            <div className="text-3xl font-bold text-amber-500">4.8 <span className="text-sm">★</span></div>
            <p className="text-xs text-slate-400 mt-1">156 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
