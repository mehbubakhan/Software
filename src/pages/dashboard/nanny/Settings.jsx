import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { 
  User, 
  Lock, 
  MapPin, 
  Bell, 
  Globe, 
  AlertTriangle, 
  CreditCard,
  Save,
  CheckCircle2,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Download,
  Trash2,
  VolumeX,
  PhoneCall
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [savedStatus, setSavedStatus] = useState('');

  const [profileData, setProfileData] = useState({ experience: '', workType: '', skills: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/nanny/profile');
        if (res.data?.data) {
          setProfileData({
            experience: res.data.data.experience || '',
            workType: '', // Not in schema, ignore or store in bio
            skills: res.data.data.skills ? JSON.parse(res.data.data.skills).join(', ') : ''
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSavedStatus('Saving...');
    try {
      if (activeTab === 'profile') {
        const skillsArray = profileData.skills.split(',').map(s => s.trim()).filter(Boolean);
        await api.post('/nanny/profile', {
          experience: profileData.experience,
          skills: JSON.stringify(skillsArray)
        });
      }
      setSavedStatus('Saved successfully!');
      setTimeout(() => setSavedStatus(''), 3000);
    } catch (err) {
      setSavedStatus('Error saving');
      setTimeout(() => setSavedStatus(''), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          Control Center <SettingsIcon className="w-8 h-8 text-slate-400" />
        </h1>
        <p className="text-slate-500 mt-2">Manage your identity, safety rules, communication preferences, and emergency system.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { id: 'profile', icon: User, label: 'Profile Details' },
            { id: 'privacy', icon: Lock, label: 'Privacy & Security' },
            { id: 'location', icon: MapPin, label: 'Location Rules' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'language', icon: Globe, label: 'Language' },
            { id: 'sos', icon: AlertTriangle, label: 'SOS Contacts', danger: true },
            { id: 'payment', icon: CreditCard, label: 'Payment Accounts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? tab.danger 
                    ? 'bg-red-50 text-red-700 shadow-sm border border-red-100' 
                    : 'bg-[#f0f9ff] text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? (tab.danger ? 'text-red-500' : 'text-blue-500') : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <form onSubmit={handleSave} className="p-8">
            
            {/* 1. PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Details</h2>
                  <p className="text-slate-500 text-sm">Control nanny identity and professional information.</p>
                </div>
                
                {/* Profile Strength Meter */}
                <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-xl p-5 flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-blue-900">Profile Strength</span>
                      <span className="text-xl font-black text-blue-700">80%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[80%]"></div>
                    </div>
                    <p className="text-xs text-blue-800 mt-2 font-medium">Higher completion leads to higher job ranking in search.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Basic Info</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" defaultValue="Sarah Johnson" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+880 1711 000000" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                    <input type="text" defaultValue="Gulshan 2, Dhaka" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
                  </div>

                  <div className="col-span-2 mt-4">
                    <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Professional Info</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Experience Level</label>
                    <input type="text" value={profileData.experience} onChange={e => setProfileData({...profileData, experience: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="e.g. 5 years" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Type Preference</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500">
                      <option>Full-time Live-out</option>
                      <option>Part-time</option>
                      <option>Live-in</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Skills (comma separated)</label>
                    <input type="text" value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="e.g. Newborn Care, CPR" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRIVACY & SECURITY */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Privacy & Security</h2>
                  <p className="text-slate-500 text-sm">Protect your data and control visibility.</p>
                </div>
                
                {/* Trusted Mode */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-purple-900 flex items-center gap-2"><Shield className="w-5 h-5" /> Trusted Mode</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-purple-800">When enabled, only verified parents can contact you or view your full profile.</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Account Privacy</h3>
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-900">Public Profile</h4>
                      <p className="text-xs text-slate-500">Allow your profile to appear in search results.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Security</h3>
                  <button type="button" className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-slate-400" />
                      <span className="font-bold text-slate-700">Change Password</span>
                    </div>
                  </button>
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <h4 className="font-bold text-slate-900">Two-Factor Authentication (OTP)</h4>
                        <p className="text-xs text-slate-500">Require OTP for login from new devices.</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-red-600 border-b border-red-100 pb-2">Data Protection</h3>
                  <button type="button" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm px-4 py-2">
                    <Download className="w-4 h-4" /> Download my data
                  </button>
                  <button type="button" className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm px-4 py-2">
                    <Trash2 className="w-4 h-4" /> Request Account Deletion
                  </button>
                </div>
              </div>
            )}

            {/* 3. LOCATION RULES */}
            {activeTab === 'location' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Location Rules</h2>
                  <p className="text-slate-500 text-sm">Control GPS tracking system during work.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active Work Mode</h3>
                    <ul className="text-sm text-emerald-800 space-y-1">
                      <li>• Live GPS ON automatically</li>
                      <li>• Parent + Admin can track</li>
                      <li>• Safe zone monitoring enabled</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Off Duty Mode</h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• GPS OFF</li>
                      <li>• Full privacy</li>
                    </ul>
                  </div>
                </div>

                {/* Safe Zone Radius */}
                <div className="bg-[#f0f9ff] border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-2">Safe Zone Radius Setting</h3>
                  <p className="text-sm text-blue-800 mb-4">Set the allowed tracking distance from the workplace.</p>
                  <select className="w-full border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-white">
                    <option>Inside House Only (0m)</option>
                    <option selected>House + Nearby Area (500m)</option>
                    <option>Neighborhood (2km)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Custom Controls</h3>
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <span className="font-bold text-slate-900 text-sm">Auto stop tracking after shift ends</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <span className="font-bold text-slate-900 text-sm">Emergency Override (Admin can track if SOS triggered)</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                  </label>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Notifications</h2>
                  <p className="text-slate-500 text-sm">Control alerts and updates.</p>
                </div>

                {/* Critical Alert Override */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900">Critical Alert Override</h3>
                    <p className="text-sm text-red-800 mt-1">Even if notifications are turned OFF, SOS and Emergency alerts will ALWAYS send push and SMS notifications.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Alerts */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2">Job Alerts</h3>
                    <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" /> <span className="text-sm">New job posts</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" /> <span className="text-sm">Interview requests</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" /> <span className="text-sm">Application updates</span></label>
                  </div>
                  {/* Payment Alerts */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2">Payment Alerts</h3>
                    <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" /> <span className="text-sm">Salary received</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" /> <span className="text-sm">Escrow update</span></label>
                    <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" /> <span className="text-sm">Payment pending</span></label>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900">SMS Alerts</h4>
                    <p className="text-xs text-slate-500">Receive critical updates via text message.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* 5. LANGUAGE SETTINGS */}
            {activeTab === 'language' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Language Settings</h2>
                  <p className="text-slate-500 text-sm">Make platform multilingual.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="p-6 border-2 border-blue-600 bg-blue-50 rounded-xl text-center font-bold text-blue-900 shadow-sm relative">
                    <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
                    <span className="text-4xl mb-2 block">🇬🇧</span> English
                  </button>
                  <button type="button" className="p-6 border-2 border-slate-200 bg-white rounded-xl text-center font-bold text-slate-600 hover:border-slate-300 transition-colors">
                    <span className="text-4xl mb-2 block">🇧🇩</span> Bangla
                  </button>
                </div>

                {/* AI Translation */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-purple-100 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg">AI Chat Translation</h3>
                      <p className="text-sm text-purple-800 mt-1">Automatically translate parent's messages into your preferred language.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-sm border border-purple-50 flex gap-4 items-center">
                    <div className="flex-1 bg-slate-50 p-3 rounded-lg text-slate-600">"Can you stay 30 mins late?" (English)</div>
                    <div className="text-purple-400">➔</div>
                    <div className="flex-1 bg-purple-50 p-3 rounded-lg text-purple-900 font-bold font-bangla">"আপনি কি ৩০ মিনিট দেরিতে থাকতে পারবেন?" (Bangla)</div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SOS CONTACTS */}
            {activeTab === 'sos' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle /> SOS Emergency Setup</h2>
                  <p className="text-slate-500 text-sm">Define emergency contacts for fast help.</p>
                </div>
                
                {/* Silent SOS */}
                <div className="bg-slate-900 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
                  <div>
                    <h3 className="font-bold flex items-center gap-2"><VolumeX className="w-5 h-5" /> Silent SOS Mode</h3>
                    <p className="text-slate-400 text-sm mt-1">Trigger emergency without sound or visual alerts on screen.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>

                {/* One Tap Call Chain */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2"><PhoneCall className="w-5 h-5" /> One Tap Call Chain</h3>
                  <p className="text-sm text-red-800 mb-4">When SOS is triggered, the system automatically calls these numbers in order:</p>
                  
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-red-200 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">1</div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="font-bold text-slate-900 text-sm mb-1">Admin Support Center</div>
                        <div className="text-xs text-slate-500">Platform Emergency Team</div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">2</div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="font-bold text-slate-900 text-sm mb-1">David Johnson (Husband)</div>
                        <input type="tel" defaultValue="+880 1711 000000" className="w-full mt-2 text-xs border border-slate-200 rounded px-2 py-1" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 7. PAYMENT ACCOUNTS */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Accounts</h2>
                <p className="text-slate-600 mb-6">Manage how you receive your salary and escrow releases.</p>
                
                <div className="space-y-4">
                  <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-pink-600 border border-slate-100 shadow-sm">bKash</div>
                      <div>
                        <h4 className="font-bold text-slate-900">bKash Mobile Wallet</h4>
                        <p className="text-sm text-slate-600">01711-XXXXXX</p>
                      </div>
                    </div>
                    <span className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Primary</span>
                  </div>

                  <div className="border border-slate-200 bg-white rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-orange-600 border border-slate-100 shadow-sm">Nagad</div>
                      <div>
                        <h4 className="font-bold text-slate-900">Nagad Wallet</h4>
                        <p className="text-sm text-slate-500">Not connected</p>
                      </div>
                    </div>
                    <button type="button" className="text-[#1a56db] font-bold text-sm hover:underline">Connect</button>
                  </div>
                  
                  <div className="border border-slate-200 bg-white rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm"><CreditCard className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900">Bank Account</h4>
                        <p className="text-sm text-slate-500">Not connected</p>
                      </div>
                    </div>
                    <button type="button" className="text-[#1a56db] font-bold text-sm hover:underline">Connect</button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-emerald-600 font-bold flex items-center gap-2">
                {savedStatus === 'Saved successfully!' && <><CheckCircle2 className="w-5 h-5" /> {savedStatus}</>}
                {savedStatus === 'Saving...' && <span className="animate-pulse">{savedStatus}</span>}
              </div>
              <button type="submit" className="bg-[#1a56db] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
