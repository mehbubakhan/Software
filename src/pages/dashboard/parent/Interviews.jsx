import React, { useState } from 'react'

export default function Interviews() {
  // Using static mock data since we don't have an interviews table yet
  const [interviews] = useState([
    {
      id: 1,
      nannyName: 'Maria Garcia',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Video Call',
      status: 'Upcoming'
    },
    {
      id: 2,
      nannyName: 'Sarah Jenkins',
      date: 'May 25, 2026',
      time: '2:30 PM',
      type: 'In-Person',
      status: 'Scheduled'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Interviews</h1>
          <p className="mt-2 text-slate-300">Manage your scheduled interviews with nannies.</p>
        </div>
        <button className="rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold text-white hover:bg-fuchsia-700">
          Schedule New
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map(interview => (
          <div key={interview.id} className="rounded-lg border border-slate-200/20 bg-[#151821] p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-white">{interview.nannyName}</h3>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                {interview.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-slate-300 mt-4">
              <p className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                {interview.date} at {interview.time}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-xl">📹</span>
                {interview.type}
              </p>
            </div>
            
            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700">
                Join Call
              </button>
              <button className="flex-1 rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
