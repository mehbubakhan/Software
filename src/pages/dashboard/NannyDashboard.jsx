import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Award, 
  BookOpen,
  Shield,
  AlertTriangle,
  Bell,
  ClipboardList,
  CheckCircle,
  Heart,
  Settings
} from 'lucide-react';

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { label: 'Dashboard Overview', path: '/dashboard/nanny', icon: Home },
      { label: 'Job Feed', path: '/dashboard/nanny/apply', icon: Briefcase, badge: 12 },
      { label: 'Applications', path: '/dashboard/nanny/applications', icon: ClipboardList },
      { label: 'Active Jobs', path: '/dashboard/nanny/active-jobs', icon: MapPin, dot: true },
      { label: 'Schedule', path: '/dashboard/nanny/availability', icon: Calendar }
    ]
  },
  {
    title: 'Communication & Safety',
    items: [
      { label: 'Safety Center', path: '/dashboard/nanny/safety', icon: Shield },
      { label: 'SOS Emergency', path: '/dashboard/nanny/sos', icon: AlertTriangle, danger: true },
      { label: 'Messages', path: '/dashboard/nanny/communication', icon: MessageSquare, badge: 5 }
    ]
  },
  {
    title: 'Career & Growth',
    items: [
      { label: 'Earnings', path: '/dashboard/nanny/payments', icon: DollarSign },
      { label: 'Verification', path: '/dashboard/nanny/verification', icon: CheckCircle },
      { label: 'Ratings & Reviews', path: '/dashboard/nanny/reviews', icon: Award },
      { label: 'Learning Center', path: '/dashboard/nanny/learning', icon: BookOpen },
      { label: 'Mental Wellness', path: '/dashboard/nanny/wellness', icon: Heart }
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', path: '/dashboard/nanny/settings', icon: Settings }
    ]
  }
];

export default function NannyDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.pravatar.cc/150?img=5" 
            alt="Sarah Johnson" 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">Sarah Johnson</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="bg-[#1e7b2b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Shield className="w-3 h-3" /> Verified
              </span>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">Trust Score: 4.8/5</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="bg-[#e11d48] hover:bg-[#be123c] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95">
            <AlertTriangle className="w-5 h-5" /> SOS Emergency
          </button>
          
          <div className="relative cursor-pointer hover:bg-slate-50 p-2.5 rounded-full transition-colors border border-transparent hover:border-slate-200">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#e11d48] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              3
            </span>
          </div>
          
          <button className="border-2 border-blue-100 text-[#2563eb] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <nav className="flex-1 py-6 px-4 space-y-8">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-4">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/dashboard/nanny'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-[#fdf4ff] text-[#a855f7] font-bold shadow-sm border border-[#f3e8ff]' 
                            : item.danger
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`w-5 h-5 ${isActive ? 'text-[#a855f7]' : item.danger ? 'text-red-500' : 'text-slate-400'}`} />
                          <span className="flex-1 text-[15px]">{item.label}</span>
                          
                          {item.badge && (
                            <span className="bg-[#e11d48] text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                              {item.badge}
                            </span>
                          )}
                          {item.dot && (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"></span>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
