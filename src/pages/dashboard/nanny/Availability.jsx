import React from 'react';
import { Calendar, Video, MapPin, Clock } from 'lucide-react';

export default function Schedule() {
  // Calendar data (May 2026 starts on Friday)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const blanks = Array(5).fill(null); // Sun, Mon, Tue, Wed, Thu are empty
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#1e293b] flex items-center gap-3">
          Schedule <span className="text-2xl">🗓️</span>
        </h1>
        <p className="text-slate-500 mt-2 text-[15px]">Manage your work shifts and interviews</p>
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">May 2026</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-2">
          {days.map(day => (
            <div key={day} className="text-center font-bold text-slate-500 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {blanks.map((_, index) => (
            <div key={`blank-${index}`} className="min-h-[100px] rounded-xl border border-transparent"></div>
          ))}
          {dates.map(date => {
            let bgClass = "bg-white border-slate-100 hover:border-slate-300";
            let textClass = "text-slate-700";
            let hasEvent = false;

            if (date === 27) {
              bgClass = "bg-[#a855f7] border-[#a855f7]";
              textClass = "text-white font-bold";
            } else if (date >= 28 && date <= 31) {
              bgClass = "bg-[#eff6ff] border-[#bfdbfe]";
              hasEvent = true;
            }

            return (
              <div 
                key={date} 
                className={`min-h-[100px] rounded-xl border p-3 flex flex-col transition-all cursor-pointer ${bgClass}`}
              >
                <span className={`text-sm ${textClass}`}>{date}</span>
                {hasEvent && (
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Schedule Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Upcoming Schedule</h2>
        
        <div className="space-y-4">
          {/* Item 1 */}
          <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[16px] font-bold text-slate-800">Full-time Care - Johnson Family</h3>
                <span className="bg-[#1976d2] text-white px-3 py-1 rounded-full text-xs font-bold shrink-0">Today</span>
              </div>
              <div className="text-sm text-slate-500 space-y-1 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8:00 AM - 5:00 PM</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Gulshan 2, Dhaka</div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[16px] font-bold text-slate-800">Video Interview - Ahmed Family</h3>
                <span className="bg-[#1976d2] text-white px-3 py-1 rounded-full text-xs font-bold shrink-0">Today</span>
              </div>
              <div className="text-sm text-slate-500 space-y-1 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 6:00 PM - 6:30 PM</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Online</div>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[16px] font-bold text-slate-800">Weekend Care - Rahman Family</h3>
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold shrink-0">Tomorrow</span>
              </div>
              <div className="text-sm text-slate-500 space-y-1 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10:00 AM - 6:00 PM</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Uttara, Dhaka</div>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[16px] font-bold text-slate-800">Full-time Care - Johnson Family</h3>
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold shrink-0">May 28</span>
              </div>
              <div className="text-sm text-slate-500 space-y-1 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8:00 AM - 5:00 PM</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Gulshan 2, Dhaka</div>
              </div>
            </div>
          </div>

          {/* Item 5 */}
          <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[16px] font-bold text-slate-800">In-person Interview - Khan Family</h3>
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold shrink-0">May 29</span>
              </div>
              <div className="text-sm text-slate-500 space-y-1 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 3:00 PM - 3:30 PM</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Banani, Dhaka</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Status Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Availability Status</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
            <div key={day} className="border-2 border-[#22c55e] bg-[#f0fdf4] rounded-xl p-4 text-center cursor-pointer hover:bg-green-100 transition-colors">
              <div className="font-bold text-[#16a34a] text-sm">{day}</div>
              <div className="font-bold text-[#16a34a] text-sm mt-1">Available</div>
            </div>
          ))}
          
          {['Sat', 'Sun'].map(day => (
            <div key={day} className="border-2 border-slate-200 bg-slate-50 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="font-bold text-slate-500 text-sm">{day}</div>
              <div className="font-bold text-slate-500 text-sm mt-1">Off</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
