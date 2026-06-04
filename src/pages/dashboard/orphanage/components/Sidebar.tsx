import { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  ShieldCheck,
  Calendar,
  Heart,
  Files,
  AlertCircle,
  MessageSquare,
  Bell,
  BarChart3,
  CreditCard,
  Zap,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
// @ts-ignore
import { useAuth } from '../../../../context/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth() || {};

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'children', label: 'Children', icon: Users },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'verification', label: 'Parent Verification', icon: ShieldCheck },
    { id: 'meetings', label: 'Meetings & Counselling', icon: Calendar },
    { id: 'bonding', label: 'Trial Bonding', icon: Heart },
    { id: 'documents', label: 'Documents', icon: Files },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'advanced', label: 'Advanced Features', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="flex flex-col h-screen bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 shrink-0 min-w-0"
      style={{ width: collapsed ? 64 : 260 }}
    >
      {/* Sidebar Logo / Header */}
      <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 flex-shrink-0 shadow-lg shadow-blue-500/20">
          <Heart size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate font-sans">Orphanage Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1" style={{ scrollbarWidth: 'none' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group text-left ${
                isActive
                  ? 'bg-slate-800 text-white border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
              {!collapsed && (
                <span className="text-xs font-bold truncate flex-1">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-slate-950 text-white text-[10px] rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OA'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Orphanage Admin'}</p>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors mt-0.5"
              >
                <LogOut size={10} /> Log out
              </button>
            </div>
          )}
          {collapsed && (
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

    </div>
  );
}
