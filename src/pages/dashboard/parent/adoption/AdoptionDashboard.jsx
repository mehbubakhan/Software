import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdoptionDashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans">
      <div className="max-w-5xl mx-auto mt-4">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-fuchsia-600/20 rounded-full flex items-center justify-center text-fuchsia-500 text-3xl">
              ♡
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Baby Adoption Center</h1>
          <p className="text-slate-500 max-w-2xl mx-auto mb-8">Open your heart and home to a child in need. Our adoption program connects loving families with children from licensed orphanages.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('children')} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 px-10 rounded-2xl transition shadow-lg shadow-fuchsia-600/30 flex items-center gap-3 text-lg">
              <span className="text-2xl">👥</span> Browse Children
            </button>
            <button onClick={() => navigate('orphanages')} className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-4 px-10 rounded-2xl transition flex items-center gap-3 text-lg">
              <span className="text-2xl">🏢</span> Licensed Orphanages
            </button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card 1 — Saved Children */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-fuchsia-500 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">❤️</div>
              <span className="bg-fuchsia-500/20 text-fuchsia-400 text-xs px-2 py-1 rounded-full font-bold border border-fuchsia-500/30">4 Saved</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Saved Children</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">You recently viewed Emma and Liam. Keep track of your favorite profiles here.</p>
            <button onClick={() => navigate('children')} className="w-full bg-slate-100 hover:bg-slate-700 text-slate-800 font-semibold py-2.5 rounded-xl transition text-sm">
              View Saved Profiles
            </button>
          </div>

          {/* Card 2 — Active Applications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-fuchsia-500 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">📋</div>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full font-bold border border-blue-500/30">1 Active</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Active Applications</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">Your application for Emma Stone is currently <strong className="text-slate-600">Under Review</strong>.</p>
            <button onClick={() => navigate('applications')} className="w-full bg-slate-100 hover:bg-slate-700 text-slate-800 font-semibold py-2.5 rounded-xl transition text-sm">
              Track Application
            </button>
          </div>

          {/* Card 3 — Upcoming Meetings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-fuchsia-500 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">📅</div>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold border border-green-500/30">Next: Jun 05</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Upcoming Meetings</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">Counselling session scheduled with Greenfields Orphanage.</p>
            <button onClick={() => navigate('applications')} className="w-full bg-slate-100 hover:bg-slate-700 text-slate-800 font-semibold py-2.5 rounded-xl transition text-sm">
              Open Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 4 — Adoption Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-fuchsia-500 transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">📈</div>
              <h3 className="text-xl font-bold text-slate-800">Adoption Status</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Current Progress: <strong className="text-fuchsia-400">Documents Verified</strong></p>
            
            <div className="relative pt-2">
              <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: "40%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-slate-800 justify-center bg-fuchsia-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-semibold px-1">
                <span className="text-fuchsia-400">Profile</span>
                <span className="text-fuchsia-400">Documents</span>
                <span>Counselling</span>
                <span>Trial</span>
                <span>Approval</span>
              </div>
            </div>
          </div>

          {/* Card 5 — Notifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-fuchsia-500 transition flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔔</div>
                <h3 className="text-xl font-bold text-slate-800">Recent Notifications</h3>
              </div>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold">2 New</span>
            </div>
            <div className="flex-1 space-y-3 mb-6">
              <div className="bg-slate-100/50 rounded-lg p-3 border-l-2 border-fuchsia-500 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Document Approved</p>
                  <p className="text-xs text-slate-500">Your background check was verified.</p>
                </div>
                <span className="text-xs text-slate-500">2h ago</span>
              </div>
              <div className="bg-slate-100/50 rounded-lg p-3 border-l-2 border-blue-500 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">New Message</p>
                  <p className="text-xs text-slate-500">Greenfields Orphanage sent a message.</p>
                </div>
                <span className="text-xs text-slate-500">1d ago</span>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard/parent/notifications')} className="w-full bg-transparent hover:bg-slate-100 text-fuchsia-400 border border-slate-200 font-semibold py-2.5 rounded-xl transition text-sm">
              View All Notifications
            </button>
          </div>
        </div>

        {/* Adoption Process Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Adoption Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">1</div>
              <h4 className="font-bold text-slate-800 mb-2">Browse & Select</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Explore profiles of children available for adoption and learn about their needs and personalities.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">2</div>
              <h4 className="font-bold text-slate-800 mb-2">Submit Application</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Complete the adoption application form with your personal information and motivation.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">3</div>
              <h4 className="font-bold text-slate-800 mb-2">Upload Documents</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Provide required documents including ID, proof of income, background check, and references.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">4</div>
              <h4 className="font-bold text-slate-800 mb-2">Schedule Meeting</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Arrange an online or in-person meeting with the orphanage to discuss the adoption process.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">5</div>
              <h4 className="font-bold text-slate-800 mb-2">Home Study</h4>
              <p className="text-xs text-slate-500 leading-relaxed">A social worker will visit your home to assess the environment and readiness for adoption.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">6</div>
              <h4 className="font-bold text-slate-800 mb-2">Matching & Transition</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Once approved, begin the transition process with supervised visits and bonding time.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">7</div>
              <h4 className="font-bold text-slate-800 mb-2">Finalization</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Complete legal procedures and finalize the adoption through the court system.</p>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-2xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center text-slate-800">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="text-4xl font-bold mb-1">145</div>
            <div className="text-sm font-semibold opacity-90">Children Adopted</div>
          </div>
          <div className="text-center mb-6 md:mb-0">
            <div className="text-4xl font-bold mb-1">3</div>
            <div className="text-sm font-semibold opacity-90">Licensed Orphanages</div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-4xl font-bold mb-1">98%</div>
            <div className="text-sm font-semibold opacity-90">Success Rate</div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Important Information</h3>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>All orphanages are licensed and regularly inspected by child welfare authorities.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Background checks and home studies are required for all adoptive parents.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Professional counseling and support services are available throughout the process.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>The average adoption process takes 6-12 months from application to finalization.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Virtual and in-person meetings can be scheduled with orphanages at your convenience.</span>
            </li>
          </ul>
        </div>

        {/* Ready to Begin */}
        <div className="text-center pb-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Begin?</h3>
          <p className="text-slate-500 mb-6">Start your journey today by browsing available children or scheduling a consultation.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('children')}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-8 rounded-xl transition"
            >
              View Available Children
            </button>
            <button 
              onClick={() => navigate('orphanages')}
              className="bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold py-3 px-8 rounded-xl transition"
            >
              Contact an Orphanage
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


