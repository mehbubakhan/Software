import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square,
  MapPin, 
  ShieldCheck, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Phone,
  FileText,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export default function Safety() {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState('Family Conflict');
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    let interval = null;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(time => time + 1);
      }, 1000);
    } else if (!sessionActive && sessionTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionActive, sessionTime]);

  const toggleSession = () => {
    if (!sessionActive) {
      setSessionActive(true);
    } else {
      if(window.confirm('End the current work session?')) {
        setSessionActive(false);
        setSessionTime(0);
      }
    }
  };

  const triggerSOS = () => {
    if(window.confirm('CRITICAL: Are you sure you want to trigger an SOS alert?')) {
      setSosSent(true);
      setTimeout(() => alert(`SOS TRIGGERED! Admin and local authorities are being notified.`), 500);
    }
  };

  const issueCategories = [
    { id: 'Unsafe Environment', icon: Shield, desc: 'Physical danger or threatening situation', iconColor: 'text-[#dc2626]' },
    { id: 'Harassment', icon: AlertTriangle, desc: 'Verbal or emotional abuse', iconColor: 'text-slate-600' },
    { id: 'Payment Issue', icon: FileText, desc: 'Salary not received or dispute', iconColor: 'text-amber-500' },
    { id: 'Medical Emergency', icon: Phone, desc: 'Health emergency for nanny or child', iconColor: 'text-[#dc2626]' },
    { id: 'Overwork/Exploitation', icon: Clock, desc: 'Excessive hours or unfair treatment', iconColor: 'text-slate-600' },
    { id: 'Child Emergency', icon: AlertTriangle, desc: 'Child safety or health concern', iconColor: 'text-[#dc2626]' },
    { id: 'Family Conflict', icon: MessageSquare, desc: 'Dispute with family members', iconColor: 'text-orange-500' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0f172a] mb-2 tracking-tight">Safety & Work Tracking</h1>
          <p className="text-slate-500 text-[15px]">Live location sharing and work session monitoring for your safety</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Current Work Session */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Current Work Session</h2>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${sessionActive ? 'bg-emerald-100 text-emerald-700' : 'bg-[#e0f2fe] text-[#0369a1]'}`}>
                  {sessionActive ? `Active Session` : 'Ready to Start'}
                </span>
              </div>
              
              <button 
                onClick={toggleSession}
                className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm text-[15px] ${
                  sessionActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-[#05a645] hover:bg-[#04913c]'
                }`}
              >
                {sessionActive ? (
                  <><Square className="w-5 h-5 fill-current" /> End Work Session</>
                ) : (
                  <><Play className="w-5 h-5 fill-current" /> Start Work Session</>
                )}
              </button>
            </div>

            {/* Live Location Tracking */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-blue-600 fill-blue-50" /> Live Location Tracking
              </h2>
              
              <div className="bg-[#f8fafc] rounded-2xl h-64 flex flex-col items-center justify-center border border-slate-100 mb-6 relative overflow-hidden">
                <MapPin className="w-12 h-12 text-[#2563eb] mb-3 fill-white shadow-sm rounded-full" />
                <div className="text-slate-800 font-bold mb-1">Map View</div>
                <div className="text-slate-500 text-sm">Lat: 23.8103, Lng: 90.4125</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0fdf4] rounded-xl p-5 border border-transparent hover:border-green-100 transition-colors">
                  <div className="flex items-center gap-2 text-[#16a34a] font-bold mb-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Location Sharing
                  </div>
                  <div className="text-[#15803d] text-sm">Active & visible to parent</div>
                </div>
                <div className="bg-[#f0f9ff] rounded-xl p-5 border border-transparent hover:border-blue-100 transition-colors">
                  <div className="flex items-center gap-2 text-[#2563eb] font-bold mb-1.5">
                    <Shield className="w-4 h-4" /> Safe Zone
                  </div>
                  <div className="text-[#1d4ed8] text-sm">Within assigned area</div>
                </div>
              </div>
            </div>

            {/* Recent Work Sessions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#a855f7]" /> Recent Work Sessions
              </h2>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Safety Status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Safety Status</h2>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 text-sm mb-0.5">Location Sharing</div>
                    <div className="text-slate-500 text-[13px]">Real-time GPS tracking</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 text-sm mb-0.5">Parent Monitoring</div>
                    <div className="text-slate-500 text-[13px]">Parent can see status</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 text-sm mb-0.5">Admin Oversight</div>
                    <div className="text-slate-500 text-[13px]">24/7 monitoring active</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 text-sm mb-0.5">Safe Zone Alert</div>
                    <div className="text-slate-500 text-[13px]">Boundary protection on</div>
                  </div>
                </div>
              </div>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-5">This Week</h2>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-500 text-sm font-medium">Total Hours</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">38.5h</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                <div className="bg-[#2563eb] h-2.5 rounded-full w-[80%]"></div>
              </div>

              <div className="flex justify-between items-center py-3.5 border-t border-slate-100">
                <span className="text-slate-500 text-sm font-medium">Days Worked</span>
                <span className="font-bold text-slate-900">5 / 6</span>
              </div>
              
              <div className="flex justify-between items-center pt-3.5 border-t border-slate-100">
                <span className="text-slate-500 text-sm font-medium">Attendance</span>
                <span className="font-bold text-[#16a34a]">100%</span>
              </div>
            </div>

            {/* Emergency Help Center */}
            <div className="bg-[#d90429] rounded-2xl p-6 shadow-md border border-red-800">
              <div className="flex items-center gap-3 mb-6 text-white">
                <AlertTriangle className="w-7 h-7" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Emergency Help Center</h2>
                  <div className="text-red-100 text-sm font-medium">24/7 support when you need it most</div>
                </div>
              </div>
              
              <button 
                onClick={triggerSOS}
                disabled={sosSent}
                className={`w-full bg-white text-[#d90429] font-black py-4 rounded-xl flex items-center justify-center gap-2 mb-5 transition-transform hover:scale-[1.02] shadow-sm tracking-wide ${sosSent ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" /> {sosSent ? 'SOS SENT' : 'EMERGENCY SOS'}
              </button>
              
              <div className="bg-[#9b1c1c] rounded-lg p-3 text-red-50 text-[13px] leading-relaxed font-medium">
                <span className="font-bold">When to use SOS:</span> Immediate danger, threat to safety, medical emergency, or any situation requiring urgent intervention.
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
                <Phone className="w-5 h-5 text-[#2563eb] fill-blue-50" /> Emergency Contacts
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#f8fafc] p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div>
                    <div className="font-bold text-slate-800 text-[13px] mb-0.5">SafeNanny Emergency Line</div>
                    <div className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Available: 24/7</div>
                  </div>
                  <button className="bg-[#05a645] hover:bg-[#04913c] text-white px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                    <Phone className="w-3.5 h-3.5 fill-current" /> +880 1234-567890
                  </button>
                </div>

                <div className="flex justify-between items-center bg-[#f8fafc] p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div>
                    <div className="font-bold text-slate-800 text-[13px] mb-0.5">Police Emergency</div>
                    <div className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Available: Always</div>
                  </div>
                  <button className="bg-[#05a645] hover:bg-[#04913c] text-white px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                    <Phone className="w-3.5 h-3.5 fill-current" /> 999
                  </button>
                </div>

                <div className="flex justify-between items-center bg-[#f8fafc] p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div>
                    <div className="font-bold text-slate-800 text-[13px] mb-0.5">Medical Emergency</div>
                    <div className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Available: Always</div>
                  </div>
                  <button className="bg-[#05a645] hover:bg-[#04913c] text-white px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                    <Phone className="w-3.5 h-3.5 fill-current" /> 199
                  </button>
                </div>
              </div>
            </div>

            {/* Report an Issue */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-[#a855f7]" /> Report an Issue
              </h2>
              
              <div className="text-[13px] font-bold text-slate-700 mb-3">Issue Category <span className="text-slate-400">*</span></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {issueCategories.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedIssue(cat.id)}
                    className={`border rounded-xl p-3.5 cursor-pointer transition-all ${
                      selectedIssue === cat.id 
                        ? 'border-[#a855f7] bg-transparent shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <cat.icon className={`w-4 h-4 ${cat.iconColor}`} />
                      <div className="font-bold text-slate-900 text-[14px]">{cat.id}</div>
                    </div>
                    <div className="text-slate-500 text-[12px] pl-6.5">{cat.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="text-[13px] font-bold text-slate-700 mb-2">Describe the Issue <span className="text-slate-400">*</span></div>
                <textarea 
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] placeholder:text-slate-400"
                  rows="4"
                  placeholder="Please provide as much detail as possible. This information will be kept confidential and reviewed by our support team."
                ></textarea>
              </div>

              <div className="bg-[#f0f9ff] border border-transparent rounded-xl p-4 mb-6 flex gap-3">
                <Shield className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
                <div className="text-[13px] text-[#1e3a8a] leading-relaxed">
                  <span className="font-bold">Your safety is our priority.</span> All reports are confidential and reviewed immediately. We take every report seriously and will take appropriate action to protect you.
                </div>
              </div>

              <button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm tracking-wide">
                <FileText className="w-4 h-4" /> Submit Help Request
              </button>
            </div>

            {/* Your Recent Reports */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Your Recent Reports</h2>
              
              <div className="space-y-4">
                <div className="border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="font-bold text-slate-800 text-[15px]">Payment Issue</div>
                      <div className="text-slate-400 text-xs mt-0.5">2 days ago</div>
                    </div>
                    <span className="bg-[#dcfce7] text-[#16a34a] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">resolved</span>
                  </div>
                  <div className="text-slate-600 text-sm mt-3">Payment received after admin intervention</div>
                </div>

                <div className="border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="font-bold text-slate-800 text-[15px]">Overwork</div>
                      <div className="text-slate-400 text-xs mt-0.5">1 week ago</div>
                    </div>
                    <span className="bg-[#dcfce7] text-[#16a34a] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">resolved</span>
                  </div>
                  <div className="text-slate-600 text-sm mt-3">Work hours adjusted, contract updated</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
