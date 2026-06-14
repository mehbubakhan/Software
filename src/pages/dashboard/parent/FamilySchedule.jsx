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

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', time: '09:00 AM', type: 'Activity', color: 'fuchsia' });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', time: '09:00 AM', type: 'Activity', color: 'fuchsia' });
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingId(schedule.id);
    setFormData({ title: schedule.title, time: schedule.time, type: schedule.type, color: schedule.color });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;

    if (editingId) {
      setSchedules(schedules.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
      setSchedules([...schedules, { id: Date.now(), ...formData }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">📅 Family Schedule</h1>
        <p className="text-slate-500">Manage daily routines, daycare pick-ups, and learning sessions.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-xl">Today's Timeline</h3>
          <button 
            onClick={openAddModal}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            + Add Event
          </button>
        </div>

        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-fuchsia-500/50 transition bg-slate-50/30">
              <div className="w-16 text-right">
                <span className="text-sm font-bold text-slate-600">{schedule.time.split(' ')[0]}</span>
                <span className="text-xs text-slate-500 block">{schedule.time.split(' ')[1] || ''}</span>
              </div>
              <div className={`w-3 h-3 rounded-full bg-${schedule.color}-500 shadow-[0_0_10px_rgba(var(--tw-colors-${schedule.color}-500),0.5)]`}></div>
              <div className="flex-1 bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-800">{schedule.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block bg-${schedule.color}-500/20 text-${schedule.color}-600`}>
                    {schedule.type}
                  </span>
                </div>
                <button 
                  onClick={() => openEditModal(schedule)}
                  className="text-slate-500 hover:text-slate-800 px-3 py-1 bg-slate-200 rounded-lg text-sm transition">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Event Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                  placeholder="e.g., Daycare Pickup"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Time</label>
                  <input 
                    type="text" 
                    value={formData.time} 
                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                    placeholder="e.g., 04:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Type</label>
                  <input 
                    type="text" 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})} 
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                    placeholder="e.g., Health"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Theme Color</label>
                <select 
                  value={formData.color} 
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                >
                  <option value="fuchsia">Fuchsia (Learning)</option>
                  <option value="blue">Blue (Pickup)</option>
                  <option value="green">Green (Health)</option>
                  <option value="yellow">Yellow (Alert)</option>
                  <option value="indigo">Indigo (Activity)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 rounded-xl transition shadow-lg shadow-fuchsia-500/30"
                >
                  {editingId ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



