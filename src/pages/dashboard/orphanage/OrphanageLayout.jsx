import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  HeartHandshake, 
  UserPlus, 
  BarChart2, 
  MessageSquare, 
  AlertTriangle, 
  Settings,
  Bell,
  Search
} from 'lucide-react';

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { label: 'Dashboard Home', path: '/dashboard/adoption', icon: Home },
      { label: 'Child Management', path: '/dashboard/adoption/children', icon: Users },
      { label: 'Applications', path: '/dashboard/adoption/applications', icon: FileText, badge: 2 },
    ]
  },
  {
    title: 'Scheduling & Support',
    items: [
      { label: 'Meetings', path: '/dashboard/adoption/meetings', icon: Calendar },
      { label: 'Counselling', path: '/dashboard/adoption/counselling', icon: HeartHandshake },
    ]
  },
  {
    title: 'Administration',
    items: [
      { label: 'Staff Management', path: '/dashboard/adoption/staff', icon: UserPlus },
      { label: 'Analytics', path: '/dashboard/adoption/analytics', icon: BarChart2 },
      { label: 'Messages', path: '/dashboard/adoption/messages', icon: MessageSquare, badge: 5 },
      { label: 'Reports', path: '/dashboard/adoption/reports', icon: AlertTriangle, danger: true },
      { label: 'Settings', path: '/dashboard/adoption/settings', icon: Settings }
    ]
  }
];

export default function OrphanageLayout() {
  const { user } = useAuth() || {};

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search children, applications, or staff..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">5</span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'wskl'}</p>
              <p className="text-xs text-slate-500 font-medium">Orphanage Admin</p>
            </div>
            <div className="w-9 h-9 bg-violet-100 text-violet-700 font-bold rounded-full flex items-center justify-center border border-violet-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Menu */}
        <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-xs font-black text-violet-600 uppercase tracking-widest">Adoption Module</h2>
          </div>
          
          <nav className="flex-1 py-5 px-3 space-y-6">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/dashboard/adoption'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-violet-50 text-violet-700 font-bold shadow-sm border border-violet-100' 
                            : item.danger
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`w-4 h-4 ${isActive ? 'text-violet-600' : item.danger ? 'text-red-500' : 'text-slate-400'}`} />
                          <span className="flex-1 text-[14px]">{item.label}</span>
                          
                          {item.badge && (
                            <span className="bg-violet-600 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                              {item.badge}
                            </span>
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
        <main className="flex-1 overflow-y-auto p-6 relative bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
