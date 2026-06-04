import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
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
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
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
  const { logout, user } = useAuth() || {};
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <SEO title="Nanny Portal - Smart Nanny" description="Manage your jobs, view earnings, and update your availability." />
      
      {/* Collapsible Sidebar */}
      <aside 
        className="flex flex-col h-full transition-all duration-300 bg-slate-900 border-r border-slate-800 shrink-0 min-w-0"
        style={{ width: sidebarCollapsed ? 64 : 260 }}
      >
        {/* Sidebar Logo / Header */}
        <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-600 flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Heart size={18} color="#fff" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">Nanny Workspace</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-auto"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6" style={{ scrollbarWidth: 'none' }}>
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">{group.title}</h3>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard/nanny'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group text-left ${
                      isActive
                        ? 'bg-slate-800 text-white border-l-4 border-purple-500'
                        : item.danger
                          ? 'text-red-400 hover:bg-slate-800/50 hover:text-red-300 border-l-4 border-transparent'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className={isActive ? 'text-purple-400' : item.danger ? 'text-red-400' : 'text-slate-400 group-hover:text-white'} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="text-xs font-bold truncate flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                              {item.badge}
                            </span>
                          )}
                          {item.dot && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </>
                      )}
                      {sidebarCollapsed && item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      )}
                      {sidebarCollapsed && item.dot && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
                      )}

                      {/* Collapsed tooltip */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-3 px-2 py-1 bg-slate-950 text-white text-[10px] rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'NY'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Care Specialist'}</p>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors mt-0.5"
                >
                  <LogOut size={10} /> Log out
                </button>
              </div>
            )}
            {sidebarCollapsed && (
              <button
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-slate-800 transition-colors ml-auto"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 h-16 flex-shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Nanny Portal</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-extrabold text-slate-800">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              {new Date().toLocaleDateString('en-BD', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-100">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] font-bold text-purple-700">Active</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}
