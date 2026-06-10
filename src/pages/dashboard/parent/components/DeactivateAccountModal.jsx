import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../services/api';

export default function DeactivateAccountModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [duration, setDuration] = useState('permanent');
  const [error, setError] = useState('');
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDeactivate = async () => {
    if (!password) {
      setError('Please enter your password to confirm.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // In a real app, you would pass password and duration to backend
      // await api.post('/auth/deactivate', { password, duration });
      
      // Simulate backend validation & delay
      await new Promise(res => setTimeout(res, 1000));
      
      logout();
      navigate('/login');
    } catch (err) {
      setError('Invalid password or error deactivating account.');
    } finally {
      setLoading(false);
    }
  };

  const isPermanent = duration === 'permanent';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1D27] border border-red-900/50 rounded-3xl w-full max-w-md overflow-hidden flex flex-col p-6 animate-in zoom-in duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-red-500 text-xl flex items-center gap-2"><span>⚠️</span> Deactivate Account</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕</button>
        </div>
        
        <div className="text-slate-300 mb-6 space-y-4">
          <p>Are you sure you want to deactivate your account?</p>
          
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Deactivation Duration</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition appearance-none"
              >
                <option value="1_week">1 Week</option>
                <option value="1_month">1 Month</option>
                <option value="6_months">6 Months</option>
                <option value="permanent">Permanently</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
            {error && <p className="text-sm text-red-400 font-semibold">{error}</p>}
          </div>

          <div className={`p-4 rounded-xl text-sm ${isPermanent ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-orange-900/20 text-orange-400 border border-orange-900/50'}`}>
            {isPermanent 
              ? "This action is permanent and cannot be undone. All your data, including child profiles and history, will be permanently removed."
              : `Your account will be suspended for ${duration.replace('_', ' ')}. You can log back in anytime to reactivate it early.`
            }
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeactivate}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Yes, Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}
