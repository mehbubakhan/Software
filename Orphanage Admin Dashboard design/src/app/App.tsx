import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EnhancedDashboard from './components/EnhancedDashboard';
import QuickActionModal from './components/QuickActionModal';
import ChildManagement from './components/ChildManagement';
import ApplicationManagement from './components/ApplicationManagement';
import ParentVerification from './components/ParentVerification';
import MeetingsCounselling from './components/MeetingsCounselling';
import TrialBonding from './components/TrialBonding';
import DocumentManagement from './components/DocumentManagement';
import ComplaintManagement from './components/ComplaintManagement';
import ChatSystem from './components/ChatSystem';
import NotificationCenter from './components/NotificationCenter';
import ReportsAnalytics from './components/ReportsAnalytics';
import PaymentManagement from './components/PaymentManagement';
import StaffManagement from './components/StaffManagement';
import AdvancedFeatures from './components/AdvancedFeatures';
import ProfilePage from './components/ProfilePage';
import Settings from './components/Settings';
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