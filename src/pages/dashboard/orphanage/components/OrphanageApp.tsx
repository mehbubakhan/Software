import { useState } from 'react';
import Sidebar from './Sidebar';
import EnhancedDashboard from './EnhancedDashboard';
import QuickActionModal from './QuickActionModal';
import ChildManagement from './ChildManagement';
import ApplicationManagement from './ApplicationManagement';
import ParentVerification from './ParentVerification';
import MeetingsCounselling from './MeetingsCounselling';
import TrialBonding from './TrialBonding';
import DocumentManagement from './DocumentManagement';
import ComplaintManagement from './ComplaintManagement';
import ChatSystem from './ChatSystem';
import NotificationCenter from './NotificationCenter';
import ReportsAnalytics from './ReportsAnalytics';
import PaymentManagement from './PaymentManagement';
import StaffManagement from './StaffManagement';
import AdvancedFeatures from './AdvancedFeatures';
import ProfilePage from './ProfilePage';
import Settings from './Settings';
import { Toaster } from 'sonner';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleQuickAction = (action: string) => {
    setActiveModal(action);
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <EnhancedDashboard onQuickAction={handleQuickAction} onNavigate={handleNavigate} />;
      case 'children':
        return <ChildManagement />;
      case 'applications':
        return <ApplicationManagement />;
      case 'verification':
        return <ParentVerification />;
      case 'meetings':
        return <MeetingsCounselling />;
      case 'bonding':
        return <TrialBonding />;
      case 'documents':
        return <DocumentManagement />;
      case 'complaints':
        return <ComplaintManagement />;
      case 'chat':
        return <ChatSystem />;
      case 'notifications':
        return <NotificationCenter />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'payments':
        return <PaymentManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'advanced':
        return <AdvancedFeatures />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <ProfilePage />;
      case 'logout':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Logout</h1>
            <p className="text-slate-600">You have been logged out successfully.</p>
          </div>
        );
      default:
        return <EnhancedDashboard onQuickAction={handleQuickAction} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top Header Bar */}
          <header className="flex items-center justify-between px-6 h-16 flex-shrink-0 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Orphanage Portal</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-extrabold text-slate-800 text-capitalize">
                {activeSection.replace(/-/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                {new Date().toLocaleDateString('en-BD', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-700">Online</span>
              </div>
            </div>
          </header>

          {/* Scrollable Viewport */}
          <main className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {renderContent()}
          </main>
        </div>

        {activeModal && (
          <QuickActionModal action={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </div>
    </>
  );
}