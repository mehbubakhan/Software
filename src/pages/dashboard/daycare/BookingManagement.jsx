import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function BookingManagement() {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/daycare/portal/applications');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await api.put(`/daycare/portal/applications/${id}`, { status });
      fetchBookings();
    } catch (err) {
      alert('Error updating booking');
    }
  };

  // Map backend keys if necessary (e.g. child_name, parent_name, package_type)
  const formattedBookings = bookings.map(b => ({
    id: b.id,
    childName: b.child_name || 'Unknown',
    parentName: b.parent_name || 'Unknown',
    age: b.child_age + ' years',
    package: b.package_type || 'Standard Package',
    date: new Date(b.created_at).toLocaleDateString(),
    status: b.status
  }));

  const filteredBookings = formattedBookings.filter(b => b.status === activeTab);

  return (
    <div className="p-8 max-w-5xl mx-auto text-slate-800">
      <h1 className="text-2xl font-bold mb-2">Booking Management</h1>
      <p className="text-slate-500 mb-8">Review and manage admission and booking requests</p>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'pending' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'approved' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'rejected' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </div>

        {/* List */}
        <div className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p>No {activeTab} bookings found.</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{booking.childName} <span className="text-sm font-normal text-slate-500 ml-2">({booking.age})</span></h3>
                  <div className="grid grid-cols-2 gap-y-1 mt-2 text-sm text-slate-600">
                    <p><span className="text-slate-400">Parent:</span> {booking.parentName}</p>
                    <p><span className="text-slate-400">Package:</span> {booking.package}</p>
                    <p><span className="text-slate-400">Date:</span> {booking.date}</p>
                  </div>
                </div>
                
                {activeTab === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button onClick={() => handleDecision(booking.id, 'approved')} className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm transition text-center">Approve</button>
                    <button onClick={() => handleDecision(booking.id, 'rejected')} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition text-center">Reject</button>
                  </div>
                )}
                
                {activeTab !== 'pending' && (
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${activeTab === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {activeTab.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
