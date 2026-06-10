import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Home, Users, ShieldCheck, AlertTriangle, Building, 
  ClipboardList, Video, LifeBuoy, CreditCard, Bell, 
  BarChart2, Settings, LogOut, FileText, Baby, ShoppingCart, Star
} from 'lucide-react'

const navGroups = [
  {
    title: 'Platform Control',
    items: [
      { label: 'Dashboard Overview', path: '/dashboard/admin', icon: Home },
      { label: 'User Management', path: '/dashboard/admin/users', icon: Users },
    ]
  },
  {
    title: 'Registration Approvals',
    items: [
      { label: 'Parent Approval', path: '/dashboard/admin/parent-approval', icon: ShieldCheck },
      { label: 'Nanny Approval', path: '/dashboard/admin/nanny-approval', icon: ClipboardList },
      { label: 'Daycare Approval', path: '/dashboard/admin/daycare-approval', icon: Building },
      { label: 'Marketplace Approval', path: '/dashboard/admin/marketplace-approval', icon: ShoppingCart },
      { label: 'Adoption Approval', path: '/dashboard/admin/adoption-approval', icon: Baby },
    ]
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Platform Reviews', path: '/dashboard/admin/reviews', icon: Star },
      { label: 'Child Monitoring', path: '/dashboard/admin/child-monitoring', icon: Video },
      { label: 'Transportation Monitoring', path: '/dashboard/admin/transport-monitoring', icon: Video },
    ]
  },
  {
    title: 'Safety & Finance',
    items: [
      { label: 'Payments & Billing', path: '/dashboard/admin/payments', icon: CreditCard },
      { label: 'Complaints & Reports', path: '/dashboard/admin/complaints', icon: LifeBuoy },
      { label: 'Emergency SOS Center', path: '/dashboard/admin/sos', icon: AlertTriangle, danger: true },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Notifications', path: '/dashboard/admin/notifications', icon: Bell },
      { label: 'Analytics', path: '/dashboard/admin/analytics', icon: BarChart2 },
      { label: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
    ]
  }
];

export default function AdminDashboard() {
  const { user, logout } = useAuth() || {}
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (logout) logout()
    navigate('/')
  }

  return (
    <div className="h-[calc(100vh-70px)] bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Kept white as requested */}
        <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto hidden md:flex shrink-0">
          <nav className="flex-1 py-6 px-4 space-y-8">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-4">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard/admin' && location.pathname.startsWith(item.path));
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-[#fdf4ff] text-[#a855f7] font-bold shadow-sm border border-[#f3e8ff]' 
                            : item.danger
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-[#a855f7]' : item.danger ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className="flex-1 text-[15px]">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
              <LogOut className="w-5 h-5 text-slate-400" />
              <span className="text-[15px]">Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
