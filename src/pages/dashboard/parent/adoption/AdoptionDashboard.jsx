import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdoptionDashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-5xl mx-auto mt-4">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-fuchsia-600/20 rounded-full flex items-center justify-center text-fuchsia-500 text-3xl">
              ♡
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Baby Adoption Center</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Open your heart and home to a child in need. Our adoption program connects loving families with children from licensed orphanages.</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => navigate('children')}
            className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-fuchsia-500 transition group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Browse Children</h3>
            <p className="text-sm text-slate-400">Explore profiles of children available for adoption.</p>
          </div>

          <div 
            onClick={() => navigate('orphanages')}
            className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-fuchsia-500 transition group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
            <h3 className="text-xl font-bold text-white mb-2">Licensed Orphanages</h3>
            <p className="text-sm text-slate-400">Explore verified and licensed care facilities.</p>
          </div>

          <div 
            onClick={() => navigate('applications')}
            className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-fuchsia-500 transition group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">My Applications</h3>
            <p className="text-sm text-slate-400">Track your adoption application status.</p>
          </div>
        </div>

        {/* Adoption Process Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Adoption Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">1</div>
              <h4 className="font-bold text-white mb-2">Browse & Select</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Explore profiles of children available for adoption and learn about their needs and personalities.</p>
            </div>
            
            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">2</div>
              <h4 className="font-bold text-white mb-2">Submit Application</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Complete the adoption application form with your personal information and motivation.</p>
            </div>
            
            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">3</div>
              <h4 className="font-bold text-white mb-2">Upload Documents</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Provide required documents including ID, proof of income, background check, and references.</p>
            </div>

            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">4</div>
              <h4 className="font-bold text-white mb-2">Schedule Meeting</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Arrange an online or in-person meeting with the orphanage to discuss the adoption process.</p>
            </div>

            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">5</div>
              <h4 className="font-bold text-white mb-2">Home Study</h4>
              <p className="text-xs text-slate-400 leading-relaxed">A social worker will visit your home to assess the environment and readiness for adoption.</p>
            </div>

            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">6</div>
              <h4 className="font-bold text-white mb-2">Matching & Transition</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Once approved, begin the transition process with supervised visits and bonding time.</p>
            </div>

            <div className="bg-[#1a1c2d] p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl pt-2 pr-2">7</div>
              <h4 className="font-bold text-white mb-2">Finalization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Complete legal procedures and finalize the adoption through the court system.</p>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-2xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center text-white">
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
        <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Important Information</h3>
          <ul className="space-y-4 text-sm text-slate-300">
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
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Begin?</h3>
          <p className="text-slate-400 mb-6">Start your journey today by browsing available children or scheduling a consultation.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('children')}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-8 rounded-xl transition"
            >
              View Available Children
            </button>
            <button 
              onClick={() => navigate('orphanages')}
              className="bg-transparent hover:bg-slate-800 border border-slate-600 text-white font-semibold py-3 px-8 rounded-xl transition"
            >
              Contact an Orphanage
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
