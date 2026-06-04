import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function AdoptionSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetingType, setMeetingType] = useState('virtual');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const response = await api.get(`/adoption/children/${id}`);
        setChild(response.data.data);
      } catch (err) {
        console.error('Error fetching child:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Meeting request submitted successfully! An orphanage representative will contact you to confirm.');
    navigate(-1);
  };

  if (loading) return <div className="text-center text-slate-400 py-12">Loading schedule...</div>;
  if (!child) return <div className="text-center text-slate-400 py-12">Child not found.</div>;

  const childName = child.child_name || child.name || 'Child Profile';
  const childLocation = child.orphanage_name || child.currentLocation || 'Adoption center';

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Schedule a Meeting</h1>
          <p className="text-slate-400">{childLocation}</p>
        </div>

        <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Select Meeting Type</h3>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div 
              onClick={() => setMeetingType('virtual')}
              className={`flex-1 border rounded-xl p-6 cursor-pointer transition flex items-center gap-4 ${meetingType === 'virtual' ? 'bg-fuchsia-900/20 border-fuchsia-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
            >
              <div className={`text-2xl ${meetingType === 'virtual' ? 'text-fuchsia-400' : 'text-slate-400'}`}>💻</div>
              <div>
                <div className="font-bold text-white mb-1">Virtual Meeting</div>
                <div className="text-sm text-slate-400">Online video call via secure link</div>
              </div>
            </div>

            <div 
              onClick={() => setMeetingType('in-person')}
              className={`flex-1 border rounded-xl p-6 cursor-pointer transition flex items-center gap-4 ${meetingType === 'in-person' ? 'bg-fuchsia-900/20 border-fuchsia-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
            >
              <div className={`text-2xl ${meetingType === 'in-person' ? 'text-fuchsia-400' : 'text-slate-400'}`}>📍</div>
              <div>
                <div className="font-bold text-white mb-1">In-Person Visit</div>
                <div className="text-sm text-slate-400">Visit the facility in-person</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold text-white mb-4">Meeting Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Date *</label>
                <input type="date" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-fuchsia-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Time *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map(time => (
                    <div 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`text-center py-3 rounded-xl border cursor-pointer transition text-sm font-semibold ${selectedTime === time ? 'bg-fuchsia-600 border-fuchsia-600 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Purpose of Meeting *</label>
                <select required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-fuchsia-500 appearance-none">
                  <option value="">Select purpose</option>
                  <option value="intro">Initial Introduction & Q&A</option>
                  <option value="meet">Meet with Social Worker</option>
                  <option value="child">Supervised interaction with child</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Additional Notes (Optional)</label>
                <textarea rows={3} placeholder="Any specific questions or topics you'd like to discuss..." className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-fuchsia-500"></textarea>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 text-blue-300 rounded-xl p-4 text-sm">
                <strong>Note:</strong> Meeting requests are subject to availability. You'll receive a confirmation email within 24 hours.
              </div>

              <button 
                type="submit"
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-fuchsia-900/20"
              >
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl">📞</div>
          <div>
            <h4 className="font-bold text-white mb-1">Contact Information</h4>
            <div className="text-sm text-slate-400 space-y-1">
              <p>Address: 123 Hope Street, Downtown</p>
              <p>Email: info@sunshinechildrenshome.org</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
