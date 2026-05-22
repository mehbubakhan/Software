import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function ChildDaycareDashboard() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/daycare/child/${childId}/report`);
        setReport(response.data.data);
      } catch (err) {
        console.error('Error fetching child report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [childId]);

  if (loading) {
    return <div className="text-center text-slate-400 py-12">Loading child report...</div>;
  }

  if (!report) {
    return <div className="text-center text-slate-400 py-12">Report not found.</div>;
  }

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => navigate('/dashboard/parent')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back to Parent Dashboard
        </button>

        {/* Header Section */}
        <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full border-4 border-fuchsia-500 bg-slate-800 flex items-center justify-center text-4xl">
              👧
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{report.name}</h1>
              <p className="text-slate-400">{report.age} • Enrolled at <span className="text-fuchsia-400 font-semibold">{report.daycare}</span></p>
              <div className="mt-3 flex gap-3">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold">● Active</span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold">{report.date}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 relative z-10">
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-6 py-3 rounded-xl transition">
              Message Teacher
            </button>
            <button onClick={() => navigate(`/dashboard/parent/daycare/1/cctv`)} className="bg-transparent hover:bg-slate-800 border border-slate-600 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2">
              <span className="text-red-500">●</span> Live CCTV
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-2xl">😊</div>
            <div>
              <div className="text-sm text-slate-400">Overall Mood</div>
              <div className="font-bold text-white">{report.overallMood}</div>
            </div>
          </div>
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center text-2xl">🍱</div>
            <div>
              <div className="text-sm text-slate-400">Meals</div>
              <div className="font-bold text-white">{report.meals}</div>
            </div>
          </div>
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-2xl">💤</div>
            <div>
              <div className="text-sm text-slate-400">Nap Time</div>
              <div className="font-bold text-white">{report.napTime}</div>
            </div>
          </div>
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center text-2xl">🎨</div>
            <div>
              <div className="text-sm text-slate-400">Activities</div>
              <div className="font-bold text-white">{report.activitiesCount} Completed</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Timeline */}
          <div className="xl:col-span-2">
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-8 border-b border-slate-700 pb-4">Daily Activity Timeline</h2>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-fuchsia-500 before:via-purple-500 before:to-slate-800">
                
                {report.timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1a1c2d] bg-slate-800 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-lg">
                      {item.icon}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111322] border border-slate-700 p-4 rounded-xl shadow">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-fuchsia-400">{item.title}</div>
                        <div className="text-xs font-bold text-slate-500">{item.time}</div>
                      </div>
                      <div className="text-sm text-slate-300">{item.desc}</div>
                    </div>
                  </div>
                ))}
                
              </div>
            </div>
          </div>

          {/* Side Details */}
          <div className="space-y-6">
            
            {/* Teacher Notes */}
            <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-2xl p-6">
              <h3 className="font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
                <span>📝</span> Teacher's Note
              </h3>
              <p className="text-sm text-fuchsia-100 italic leading-relaxed">"{report.teacherNotes}"</p>
            </div>

            {/* Detailed Summaries */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-6 border-b border-slate-700 pb-3">Care Details</h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-400 mb-3">Meal Tracking</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-300">Breakfast (9:30 AM)</span>
                    <span className="text-green-400 font-semibold text-right max-w-[150px]">{report.mealDetails.breakfast.note}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-300">Lunch (11:30 AM)</span>
                    <span className="text-yellow-400 font-semibold text-right max-w-[150px]">{report.mealDetails.lunch.note}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-300">Snack (2:30 PM)</span>
                    <span className="text-green-400 font-semibold text-right max-w-[150px]">{report.mealDetails.snack.note}</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-400 mb-3">Nap Schedule</h4>
                <div className="bg-[#111322] border border-slate-700 p-4 rounded-xl text-sm">
                  <div className="flex justify-between mb-2"><span className="text-slate-400">Duration:</span> <span className="font-bold text-white">{report.napDetails.duration}</span></div>
                  <div className="flex justify-between mb-2"><span className="text-slate-400">Quality:</span> <span className="font-bold text-green-400">{report.napDetails.quality}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Notes:</span> <span className="text-slate-300 text-right max-w-[150px]">{report.napDetails.notes}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-400 mb-3">Diaper Changes</h4>
                <div className="flex flex-wrap gap-2">
                  {report.diaperChanges.map((change, idx) => (
                    <div key={idx} className="bg-[#111322] border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-400">{change.time}</span> - <span className={change.type === 'Wet' ? 'text-blue-400' : 'text-orange-400'}>{change.type}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Photo Gallery Placeholder */}
            <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Today's Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {report.photos.map((photo, idx) => (
                  <div key={idx} className="aspect-square bg-slate-800 rounded-xl flex items-center justify-center text-3xl opacity-50 hover:opacity-100 transition cursor-pointer">
                    📷
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
