import { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  ShieldCheck,
  Calendar,
  MessageCircle,
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
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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

  const bottomItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <div className="w-64 bg-[#1a1f36] text-white h-screen flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Orphanage Admin</h1>
        <p className="text-sm text-gray-400 mt-1">Management Dashboard</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
