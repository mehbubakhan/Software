import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSocket } from '../../../context/SocketContext';

export default function Notifications() {
  const [success, setSuccess] = useState(false);
  const { notifications } = useSocket() || { notifications: [] };

  const handleSend = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" /> System Notifications
        </h1>
        <p className="text-slate-500 font-medium mt-2">Broadcast alerts, announcements, and reminders to all users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6">Send New Broadcast</h2>
          
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Target Audience</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700">
                <option value="all">All Users (Parents, Nannies, Daycares)</option>
                <option value="parents">Parents Only</option>
                <option value="nannies">Nannies Only</option>
                <option value="daycares">Daycares Only</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Notification Title</label>
              <input type="text" placeholder="e.g. System Maintenance Update" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message Content</label>
              <textarea placeholder="Write your announcement here..." required rows="4" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none"></textarea>
            </div>

            {success && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 font-bold">
                <CheckCircle2 className="w-5 h-5" /> Broadcast sent successfully!
              </div>
            )}

            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black shadow-sm transition flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Notification
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6">Recent Broadcasts & Alerts</h2>
          
          <div className="space-y-4">
            {notifications && notifications.length > 0 && notifications.map((notif, idx) => (
              <div key={notif.id || idx} className="p-4 rounded-xl border border-red-200 bg-red-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> System Alert
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Just now</span>
                </div>
                <h4 className="font-bold text-slate-900">{notif.title}</h4>
                <p className="text-sm text-slate-700 mt-1">{notif.message}</p>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">All Users</span>
                <span className="text-xs text-slate-400 font-medium">2 days ago</span>
              </div>
              <h4 className="font-bold text-slate-900">New Safety Guidelines Update</h4>
              <p className="text-sm text-slate-600 mt-1">Please review the updated safe-zone protocols in your dashboard settings.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Nannies Only</span>
                <span className="text-xs text-slate-400 font-medium">1 week ago</span>
              </div>
              <h4 className="font-bold text-slate-900">Payment Escrow Policy</h4>
              <p className="text-sm text-slate-600 mt-1">Escrow funds will now clear within 24 hours of job completion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
