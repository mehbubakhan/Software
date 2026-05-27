import React, { useState, useEffect } from 'react'
import api from '../../../services/api'

export default function FamilySchedule() {
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    // Mocking the fetch call for MVP
    setSchedules([
      { id: 1, title: 'Daycare Pickup', time: '04:00 PM', type: 'Pickup', color: 'blue' },
      { id: 2, title: 'Math Learning', time: '05:30 PM', type: 'Learning', color: 'fuchsia' },
      { id: 3, title: 'Medicine (Vitamin C)', time: '08:00 PM', type: 'Health', color: 'green' }
    ])
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="bg-[#1A1D27] rounded-3xl p-8 border border-[#2A2E3D] shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">📅 Family Schedule</h1>
        <p className="text-slate-400">Manage daily routines, daycare pick-ups, and learning sessions.</p>
      </div>

      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-xl">Today's Timeline</h3>
          <button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            + Add Event
          </button>
        </div>

        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#2A2E3D] hover:border-fuchsia-500/50 transition bg-slate-800/30">
              <div className="w-16 text-right">
                <span className="text-sm font-bold text-slate-300">{schedule.time.split(' ')[0]}</span>
                <span className="text-xs text-slate-500 block">{schedule.time.split(' ')[1]}</span>
              </div>
              <div className={`w-3 h-3 rounded-full bg-${schedule.color}-500 shadow-[0_0_10px_rgba(var(--tw-colors-${schedule.color}-500),0.5)]`}></div>
              <div className="flex-1 bg-slate-800 rounded-xl p-4 flex justify-between items-center border border-slate-700">
                <div>
                  <h4 className="font-bold text-white">{schedule.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block bg-${schedule.color}-500/20 text-${schedule.color}-400`}>
                    {schedule.type}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white px-3 py-1 bg-slate-700 rounded-lg text-sm">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
