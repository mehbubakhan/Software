import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/AuthContext";
import {
  LayoutDashboard, Users, UserPlus, UserCheck, UserCog,
  Monitor, Bus, Calendar, HeartPulse, CreditCard,
  MessageSquare, Bell, BarChart3, Settings, User,
  LogOut, ChevronLeft, ChevronRight, Baby, FileWarning, Brain, Star
} from "lucide-react";
import type { Section } from "./types";

const navItems: { id: Section; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "children", label: "Children", icon: <Baby size={18} /> },
  { id: "admissions", label: "Admissions", icon: <UserPlus size={18} />, badge: 2 },
  { id: "parents", label: "Parents", icon: <Users size={18} /> },
  { id: "staff", label: "Staff & Nannies", icon: <UserCog size={18} /> },
  { id: "live-monitoring", label: "Live Monitoring", icon: <Monitor size={18} /> },
  { id: "transportation", label: "Transportation", icon: <Bus size={18} /> },
  { id: "daily-activities", label: "Daily Activities", icon: <Calendar size={18} /> },
  { id: "health-medicine", label: "Health & Medicine", icon: <HeartPulse size={18} /> },
  { id: "billing", label: "Billing & Payments", icon: <CreditCard size={18} />, badge: 1 },
  { id: "complaints", label: "Complaints", icon: <FileWarning size={18} /> },
  { id: "chat", label: "Chat", icon: <MessageSquare size={18} />, badge: 3 },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} />, badge: 3 },
  { id: "analytics", label: "Reports & Analytics", icon: <BarChart3 size={18} /> },
  { id: "ai-center", label: "AI & Security", icon: <Brain size={18} /> },
  { id: "reviews", label: "Reviews & Ratings", icon: <Star size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  { id: "profile", label: "Profile", icon: <User size={18} /> },
];

interface SidebarProps {
  active: Section;
  onSelect: (s: Section) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth() || {};

  function handleLogout() {
    logout?.();
    navigate('/login');
  }

  return (
    <aside
      className={`flex flex-col h-screen bg-[#19163f] text-white transition-all duration-300 shrink-0 ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center shrink-0">
          <Baby size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white text-sm leading-tight" style={{ fontWeight: 700 }}>TinySteps</p>
            <p className="text-white/50 text-xs">Daycare Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white/40 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all relative group rounded-lg ${
              active === item.id
                ? "bg-[#4f46e5] text-white shadow-sm"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="text-sm truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Logout"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
