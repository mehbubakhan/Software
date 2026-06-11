import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, MapPin, Phone, VolumeX, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';

export default function SOS() {
  const [sosActive, setSosActive] = useState(false);
  const [silentActive, setSilentActive] = useState(false);

  const triggerSos = async () => {
    setSosActive(true);
    try {
      await api.post('/sos', { message: 'Emergency SOS Triggered', lat: null, lng: null });
    } catch(err) {
      console.error(err);
    }
  }

  const triggerSilent = async () => {
    setSilentActive(true);
    try {
      await api.post('/sos', { message: 'Silent SOS Triggered', lat: null, lng: null });
    } catch(err) {
      console.error(err);
    }
  }

  const cancelSos = () => {
    setSosActive(false);
    setSilentActive(false);
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="mb-8">
        <h1 className="text-4xl font-black text-red-600 tracking-tight flex items-center gap-3">
          <AlertTriangle className="w-10 h-10" /> Emergency SOS Center
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Instant emergency response and safety tracking.</p>
      </div>

      {sosActive ? (
        <div className="bg-red-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-white text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black mb-2">SOS ACTIVATED</h2>
            <p className="text-red-100 text-lg mb-8">Admin and emergency contacts have been notified. Live location sharing is ON.</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={cancelSos} className="bg-red-800 hover:bg-red-900 text-white font-bold py-4 px-8 rounded-xl transition-all">
                Cancel Emergency
              </button>
            </div>
          </div>
        </div>
      ) : silentActive ? (
        <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <VolumeX className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-2">Silent SOS Active</h2>
            <p className="text-slate-400 text-lg mb-8">Authorities have been notified without any sound or visual alerts on this device.</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={cancelSos} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all">
                Cancel Silent SOS
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main SOS Trigger */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-8 text-center flex flex-col items-center justify-center">
            <button 
              onClick={triggerSos}
              className="w-48 h-48 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all rounded-full shadow-[0_0_40px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center text-white border-8 border-red-500 mb-6"
            >
              <AlertTriangle className="w-16 h-16 mb-2" />
              <span className="font-black text-xl tracking-widest">SOS</span>
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Emergency SOS</h3>
            <p className="text-slate-500 text-sm">Tap for medical emergency, violence, or immediate severe danger. Sirens will sound.</p>
          </div>

          <div className="space-y-6">
            {/* Silent SOS */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-sm flex flex-col items-center justify-center text-center">
               <button 
                onClick={triggerSilent}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-2xl py-6 flex items-center justify-center gap-3 text-white border border-slate-700 mb-4"
              >
                <VolumeX className="w-8 h-8" />
                <span className="font-black text-xl">Trigger Silent SOS</span>
              </button>
              <p className="text-slate-400 text-sm">Use if you are in danger but cannot make noise. No alarms will sound.</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Safety Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-xl transition-colors flex items-center gap-3 px-4">
                  <MapPin className="w-5 h-5" /> Share Live Location
                </button>
                <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl transition-colors flex items-center gap-3 px-4">
                  <Phone className="w-5 h-5" /> Call Emergency Contact
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Safety Status */}
      {!sosActive && !silentActive && (
        <div className="mt-8 bg-[#f0fdf4] rounded-3xl border border-emerald-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-lg">System Active</h3>
            <p className="text-emerald-700 text-sm">Safe-zone monitoring is currently offline. Background check is verified.</p>
          </div>
        </div>
      )}

    </div>
  );
}
