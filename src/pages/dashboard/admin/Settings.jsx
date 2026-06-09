import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Shield, Globe, CreditCard } from 'lucide-react';

export default function Settings() {
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-700" /> Platform Settings
        </h1>
        <p className="text-slate-500 font-medium mt-2">Configure core system variables, payment gateways, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full text-left px-5 py-4 bg-white border-2 border-blue-500 text-blue-700 rounded-2xl font-bold shadow-sm flex items-center gap-3">
            <Globe className="w-5 h-5" /> General Configuration
          </button>
          <button className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl font-bold transition flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-400" /> Payment Gateways
          </button>
          <button className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl font-bold transition flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-400" /> Security & 2FA
          </button>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">General Configuration</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Platform Name</label>
              <input type="text" defaultValue="Childcare Platform" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Support Email</label>
              <input type="email" defaultValue="support@childcare.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Commission Rate (%)</label>
              <input type="number" defaultValue="5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" />
              <p className="text-xs text-slate-500 mt-1">Percentage taken from nanny/daycare payments.</p>
            </div>

            <div className="pt-4 flex justify-end items-center gap-4">
              {success && <span className="text-emerald-600 font-bold text-sm">Settings saved!</span>}
              <button type="submit" className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black shadow-sm transition flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
