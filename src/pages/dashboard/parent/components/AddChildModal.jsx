import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

export default function AddChildModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [currentDaycare, setCurrentDaycare] = useState('');
  const [healthNotes, setHealthNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || '');
      setAge(initialData.age ? parseInt(initialData.age) : '');
      setGender(initialData.gender || 'Male');
      setCurrentDaycare(initialData.currentDaycare || '');
      setHealthNotes(initialData.healthStatus || '');
    } else if (isOpen) {
      setName('');
      setAge('');
      setGender('Male');
      setCurrentDaycare('');
      setHealthNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name, age, gender, currentDaycare, healthNotes };
      const res = initialData 
        ? await api.put(`/families/my/children/${initialData.id}`, payload)
        : await api.post('/families/my/children', payload);
        
      if (res.data.ok) {
        onSuccess();
        onClose();
      } else {
        alert(res.data.error || `Failed to ${initialData ? 'update' : 'add'} child`);
      }
    } catch (err) {
      alert(`Error ${initialData ? 'updating' : 'adding'} child: ` + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1D27] border border-[#2A2E3D] rounded-3xl w-full max-w-md overflow-hidden flex flex-col p-6 animate-in zoom-in duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-xl flex items-center gap-2"><span>👶</span> {initialData ? 'Edit Child' : 'Add Child'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Child's Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition" 
              placeholder="e.g. Emma" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Age</label>
            <input 
              type="number" 
              required
              min="0"
              max="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition" 
              placeholder="e.g. 4" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Gender</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Current Daycare (Optional)</label>
            <input 
              type="text" 
              value={currentDaycare}
              onChange={(e) => setCurrentDaycare(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition" 
              placeholder="e.g. Sunshine Daycare" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Health Status / Allergies (Optional)</label>
            <textarea 
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition resize-none" 
              placeholder="e.g. Peanut allergy, all vaccinations up to date" 
            ></textarea>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-3 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-500 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Child')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
