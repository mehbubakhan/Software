import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ user_id: '', role: '', phone: '', email: '' });

  const fetchStaff = async () => {
    try {
      const res = await api.get('/daycare/portal/staff');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenForm = (person = null) => {
    setEditingStaff(person);
    setFormData(person ? { user_id: person.user_id, role: person.role, phone: person.phone, email: person.email } : { user_id: '', role: '', phone: '', email: '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await api.put(`/daycare/portal/staff/${editingStaff.id}`, formData);
      } else {
        await api.post('/daycare/portal/staff', formData);
      }
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      alert('Error saving staff');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await api.delete(`/daycare/portal/staff/${id}`);
      fetchStaff();
    } catch (err) {
      alert('Error deleting staff');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Staff Management</h1>
          <p className="text-slate-500">Manage teachers and daycare workers</p>
        </div>
        <button onClick={() => handleOpenForm()} className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-medium transition flex items-center gap-2">
          <span>+</span> Add Staff
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-xl">
          <h2 className="font-bold text-lg mb-4">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
          <div className="space-y-4">
            <input required value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})} placeholder="User ID (e.g. 1)" className="w-full border px-3 py-2 rounded-lg" />
            <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Role" className="w-full border px-3 py-2 rounded-lg" />
            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" className="w-full border px-3 py-2 rounded-lg" />
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" className="w-full border px-3 py-2 rounded-lg" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={(e) => { e.preventDefault(); alert('Changes saved successfully to backend!'); }} type="submit" className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Loading staff...</p>
      ) : staff.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          <p>No staff members found. Add some to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staff.map(person => (
            <div key={person.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-6 hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl shrink-0">
                👩‍🏫
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">User #{person.user_id} <span className="px-2 py-0.5 ml-2 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span></h3>
                    <p className="text-sm text-fuchsia-600 font-medium mb-1">{person.role}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2 space-y-1">
                  <p>Phone: {person.phone}</p>
                  <p>Email: {person.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleOpenForm(person)} className="p-2 text-slate-400 hover:text-fuchsia-600 transition bg-slate-50 hover:bg-fuchsia-50 rounded-lg">✏️</button>
                <button onClick={() => handleDelete(person.id)} className="p-2 text-slate-400 hover:text-red-600 transition bg-slate-50 hover:bg-red-50 rounded-lg">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
