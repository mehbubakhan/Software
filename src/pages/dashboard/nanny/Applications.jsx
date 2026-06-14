import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  Video, 
  MessageCircle, 
  XCircle,
  MoreVertical,
  CheckCircle2,
  Clock3,
  CalendarDays,
  X,
  Send,
  FileText,
  Download,
  Check
} from 'lucide-react';

export default function Applications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [chatModalApp, setChatModalApp] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: "Hi! We reviewed your profile and we're really excited for our interview tomorrow.", sender: "family" }
  ]);
  const [contractModalApp, setContractModalApp] = useState(null);

  const handleSendChat = (e) => {
    e.preventDefault();
    if(!chatMessage) return;
    setChatHistory(prev => [...prev, { text: chatMessage, sender: "nanny" }]);
    setChatMessage('');
  };

  const tabs = ['All', 'Pending', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'];

  const initialApplications = [
    {
      id: 1,
      family: 'Rahman Family',
      location: 'Banani, Dhaka',
      role: 'Part-time Infant Care',
      salary: '15,000 BDT/month',
      appliedDate: '2 days ago',
      status: 'Interview',
      interviewDetails: {
        date: 'Tomorrow, 4:00 PM',
        type: 'Video Call'
      }
    },
    {
      id: 2,
      family: 'Hossain Family',
      location: 'Uttara, Dhaka',
      role: 'Full-time Live-out',
      salary: '22,000 BDT/month',
      appliedDate: '1 week ago',
      status: 'Shortlisted'
    },
    {
      id: 3,
      family: 'Chowdhury Family',
      location: 'Dhanmondi, Dhaka',
      role: 'Live-in Nanny',
      salary: '30,000 BDT/month',
      appliedDate: 'Just now',
      status: 'Pending'
    },
    {
      id: 4,
      family: 'Islam Family',
      location: 'Bashundhara R/A',
      role: 'Weekend Caregiver',
      salary: '10,000 BDT/month',
      appliedDate: '2 weeks ago',
      status: 'Rejected'
    },
    {
      id: 5,
      family: 'Ahmed Family',
      location: 'Gulshan 2, Dhaka',
      role: 'Full-time Nanny',
      salary: '25,000 BDT/month',
      appliedDate: '3 weeks ago',
      status: 'Accepted'
    }
  ];

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('https://backend-pi-topaz-21.vercel.app/api/applications/mine', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if(data.ok && data.data && data.data.length > 0) {
        setApplications(data.data);
      } else {
        loadLocalApplications();
      }
    } catch (err) {
      loadLocalApplications();
    }
  };

  const loadLocalApplications = () => {
    const local = localStorage.getItem('nanny_applications');
    if (local) {
      setApplications(JSON.parse(local));
    } else {
      localStorage.setItem('nanny_applications', JSON.stringify(initialApplications));
      setApplications(initialApplications);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Shortlisted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interview': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Accepted': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock3 className="w-3.5 h-3.5" />;
      case 'Shortlisted': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Interview': return <CalendarDays className="w-3.5 h-3.5" />;
      case 'Accepted': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock3 className="w-3.5 h-3.5" />;
    }
  };

  const filteredApps = activeTab === 'All' 
    ? applications 
    : applications.filter(app => app.status === activeTab);

  const handleWithdraw = (id) => {
    if(window.confirm('Are you sure you want to withdraw this application?')) {
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      localStorage.setItem('nanny_applications', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          My Applications <span className="text-2xl">📋</span>
        </h1>
        <p className="text-slate-500 mt-2">Track the status of your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Pending', count: applications.filter(a => a.status === 'Pending').length, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
          { label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Interview', count: applications.filter(a => a.status === 'Interview').length, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'Accepted', count: applications.filter(a => a.status === 'Accepted').length, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
        ].map(stat => (
          <div key={stat.label} className={`p-4 rounded-xl border ${stat.bg} ${stat.border}`}>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.count}</div>
            <div className={`text-sm font-medium mt-1 ${stat.color}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Kanban / List View */}
      <div className="space-y-4">
        {filteredApps.map(app => (
          <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{app.family}</h3>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)} {app.status}
                  </div>
                </div>
                <div className="text-slate-600 font-medium">{app.role} • {app.salary}</div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {app.location}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Applied {app.appliedDate}</span>
              </div>
            </div>

            {/* Action Area Based on Status */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Dynamic Status Content */}
              <div className="flex-1">
                {app.status === 'Interview' && (
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-purple-900 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Interview Scheduled
                    </span>
                    <span className="text-xs text-purple-700 mt-1">
                      {app.interviewDetails.date} via {app.interviewDetails.type}
                    </span>
                  </div>
                )}
                {app.status === 'Shortlisted' && (
                  <span className="text-sm text-blue-800 font-medium">The family has shortlisted your profile and is reviewing it.</span>
                )}
                {app.status === 'Pending' && (
                  <span className="text-sm text-slate-600 font-medium">Application sent. Waiting for the family to review your profile.</span>
                )}
                {app.status === 'Accepted' && (
                  <span className="text-sm text-green-800 font-bold">Congratulations! You have been accepted for this role.</span>
                )}
                {app.status === 'Rejected' && (
                  <span className="text-sm text-red-800 font-medium">Unfortunately, the family went with another candidate. Keep applying!</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {app.status === 'Interview' && (
                  <>
                    <button 
                      onClick={() => alert(`Joining video call with ${app.family}...`)}
                      className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" /> Join Call
                    </button>
                    <button 
                      onClick={() => setChatModalApp(app)}
                      className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </button>
                  </>
                )}
                
                {app.status === 'Accepted' && (
                  <button 
                    onClick={() => setContractModalApp(app)}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> View Contract
                  </button>
                )}

                {(app.status === 'Pending' || app.status === 'Shortlisted') && (
                  <button 
                    onClick={() => handleWithdraw(app.id)}
                    className="flex-1 sm:flex-none bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Withdraw
                  </button>
                )}
              </div>

            </div>

          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-lg">No applications found in this status.</p>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {chatModalApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#1a56db] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black">
                  {chatModalApp.family.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold leading-tight">{chatModalApp.family}</h3>
                  <p className="text-xs text-blue-200">Online</p>
                </div>
              </div>
              <button onClick={() => setChatModalApp(null)} className="hover:bg-blue-700 p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col justify-end gap-3">
              <div className="text-center text-xs text-slate-400 font-medium mb-2">Today, 9:41 AM</div>
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl max-w-[85%] shadow-sm text-[15px] ${
                    msg.sender === 'family' 
                      ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none self-start' 
                      : 'bg-[#1a56db] text-white rounded-tr-none self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <button type="submit" className="bg-[#1a56db] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {contractModalApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-green-600 text-white">
              <h3 className="font-black text-xl flex items-center gap-2">
                <FileText className="w-6 h-6" /> Employment Contract
              </h3>
              <button onClick={() => setContractModalApp(null)} className="hover:bg-green-700 p-1.5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="text-center pb-6 border-b border-slate-100">
                  <h4 className="text-2xl font-black text-slate-900 mb-1">{contractModalApp.role}</h4>
                  <p className="text-slate-500 font-medium">{contractModalApp.family} • {contractModalApp.location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Compensation</h5>
                    <p className="text-lg font-black text-green-600">{contractModalApp.salary}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</h5>
                    <p className="text-lg font-bold text-slate-900">June 20, 2026</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</h5>
                    <p className="text-[15px] font-medium text-slate-700">9:00 AM - 5:00 PM (Mon-Fri)</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Benefits</h5>
                    <p className="text-[15px] font-medium text-slate-700">Meals included, Paid sick leave</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h5 className="font-bold text-slate-900 mb-2">Terms & Conditions</h5>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                    <li>This agreement is bound by the labor laws of Bangladesh.</li>
                    <li>A 30-day notice period is required for termination by either party.</li>
                    <li>Payments will be processed on the 1st of every month via Minimate Escrow.</li>
                    <li>Confidentiality regarding family matters is strictly required.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
              <button className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download PDF
              </button>
              <button 
                onClick={() => {
                  alert("Contract successfully signed!");
                  setContractModalApp(null);
                }}
                className="flex-[2] bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[3]" /> Accept & Sign Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
