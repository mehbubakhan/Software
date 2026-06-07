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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Logout</h1>
            <p className="text-gray-600">You have been logged out successfully.</p>
          </div>
        );
      default:
        return <EnhancedDashboard onQuickAction={handleQuickAction} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        {activeModal && (
          <QuickActionModal action={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </div>
    </>
  );
}
