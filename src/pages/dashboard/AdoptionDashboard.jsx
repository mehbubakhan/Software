import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import AIAssistant from '../../components/AIAssistant';

// Import services
import {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  getApplications,
  updateApplicationStatus,
  getMyOrphanage
} from '../../services/adoptionApi';

// Import upgraded components
import Sidebar from './adoption/components/Sidebar';
import EnhancedDashboard from './adoption/components/EnhancedDashboard';
import ChildManagement from './adoption/components/ChildManagement';
import ApplicationManagement from './adoption/components/ApplicationManagement';
import ParentVerification from './adoption/components/ParentVerification';
import MeetingsCounselling from './adoption/components/MeetingsCounselling';
import TrialBonding from './adoption/components/TrialBonding';
import DocumentManagement from './adoption/components/DocumentManagement';
import ComplaintManagement from './adoption/components/ComplaintManagement';
import ChatSystem from './adoption/components/ChatSystem';
import NotificationCenter from './adoption/components/NotificationCenter';
import ReportsAnalytics from './adoption/components/ReportsAnalytics';
import PaymentManagement from './adoption/components/PaymentManagement';
import StaffManagement from './adoption/components/StaffManagement';
import AdvancedFeatures from './adoption/components/AdvancedFeatures';
import ProfilePage from './adoption/components/ProfilePage';
import Settings from './adoption/components/Settings';
import QuickActionModal from './adoption/components/QuickActionModal';

export default function AdoptionDashboard() {
  const { user } = useAuth() || {};
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);

  // Live Database States
  const [dbChildren, setDbChildren] = useState([]);
  const [dbApplications, setDbApplications] = useState([]);
  const [orphanage, setOrphanage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [childrenRes, appsRes, orphanageRes] = await Promise.all([
        getChildren(),
        getApplications(),
        getMyOrphanage().catch(() => ({ data: { data: null } }))
      ]);

      if (childrenRes.data?.ok) {
        setDbChildren(childrenRes.data.data || []);
      }
      if (appsRes.data?.ok) {
        setDbApplications(appsRes.data.data || []);
      }
      if (orphanageRes.data?.ok) {
        setOrphanage(orphanageRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching adoption dashboard data:', error);
      toast.error('Failed to load live dashboard data. Using mock fallbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map Backend Data Format to Frontend Component Specs
  const frontendChildren = useMemo(() => {
    if (dbChildren.length === 0) return null; // Let component use mock fallbacks if empty db
    return dbChildren.map(c => ({
      id: `CH-${c.id}`,
      dbId: c.id,
      photo: c.gender === 'Male' ? '👦' : '👧',
      name: c.child_name || 'Unnamed Child',
      nickname: (c.child_name || 'Unnamed').split(' ')[0],
      age: parseInt(c.age) || 0,
      gender: c.gender || 'Female',
      healthStatus: c.health_condition || 'Excellent',
      education: c.interests || 'Elementary',
      availability: c.adoption_status === 'available' ? 'Available' : 'In Process',
      adoptionStatus: c.adoption_status === 'available' ? 'Ready' : 'Application Pending',
      createdDate: c.created_at ? c.created_at.split('T')[0] : '2026-06-01',
      interests: c.interests || 'Drawing, Reading',
      short_description: c.short_description || ''
    }));
  }, [dbChildren]);

  const frontendApplications = useMemo(() => {
    if (dbApplications.length === 0) return null; // Let component use mock fallbacks if empty db
    return dbApplications.map(a => ({
      id: `APP-2026-${a.id}`,
      dbId: a.id,
      parentName: a.parent_name || `Parent ID: ${a.parent_id}`,
      childName: a.child_name || `Child ID: ${a.child_id}`,
      childId: `CH-${a.child_id}`,
      applicationDate: a.created_at ? a.created_at.split('T')[0] : '2026-06-01',
      status: a.application_status === 'pending' ? 'Pending Initial Review' :
              a.application_status === 'under_review' ? 'Document Verification' :
              a.application_status === 'approved' ? 'Approved - Trial Bonding' : 'Rejected',
      compatibilityScore: a.compatibility_score || 75,
      priority: a.compatibility_score >= 85 ? 'High' : 'Medium',
      phone: '+1 (555) 123-4567',
      email: 'parent@email.com',
      motivation: 'We want to provide a loving home to a child in need.',
      parentingExperience: 'Experienced caretakers.'
    }));
  }, [dbApplications]);

  // CRUD operation handlers
  const handleAddChild = async (childData) => {
    if (!orphanage?.id) {
      toast.error('Load orphanage record first before adding profiles.');
      return;
    }
    try {
      const payload = {
        orphanage_id: orphanage.id,
        child_name: childData.name,
        age: String(childData.age),
        gender: childData.gender,
        health_condition: childData.healthStatus,
        interests: childData.interests,
        short_description: childData.short_description || ''
      };
      const res = await createChild(payload);
      if (res.data?.ok) {
        toast.success(`Profile for ${childData.name} added successfully.`);
        fetchData();
      } else {
        toast.error('Failed to add child profile.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding child profile.');
    }
  };

  const handleUpdateChild = async (updatedChild) => {
    const rawId = updatedChild.dbId || parseInt(updatedChild.id.replace('CH-', ''));
    try {
      const payload = {
        child_name: updatedChild.name,
        age: String(updatedChild.age),
        gender: updatedChild.gender,
        health_condition: updatedChild.healthStatus,
        interests: updatedChild.interests,
        short_description: updatedChild.short_description
      };
      const res = await updateChild(rawId, payload);
      if (res.data?.ok) {
        toast.success('Child profile updated successfully.');
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update child profile.');
    }
  };

  const handleRemoveChild = async (childId, reason) => {
    const rawId = parseInt(childId.replace('CH-', ''));
    try {
      const res = await deleteChild(rawId);
      if (res.data?.ok) {
        toast.success(`Child profile removed successfully: ${reason}`);
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete child profile.');
    }
  };

  const handleUpdateApplication = async (updatedApp) => {
    const rawId = updatedApp.dbId || parseInt(updatedApp.id.replace('APP-2026-', ''));
    const statusMap = {
      'Pending Initial Review': 'pending',
      'Document Verification': 'under_review',
      'Approved - Trial Bonding': 'approved',
      'Rejected': 'rejected'
    };
    const backendStatus = statusMap[updatedApp.status] || 'under_review';
    try {
      const res = await updateApplicationStatus(rawId, backendStatus);
      if (res.data?.ok) {
        toast.success(`Application status updated successfully.`);
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update application status.');
    }
  };

  const handleQuickAction = (action) => {
    setActiveModal(action);
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <EnhancedDashboard
            onQuickAction={handleQuickAction}
            onNavigate={handleNavigate}
            children={frontendChildren}
            applications={frontendApplications}
          />
        );
      case 'children':
        return (
          <ChildManagement
            children={frontendChildren}
            onAddChild={handleAddChild}
            onUpdateChild={handleUpdateChild}
            onRemoveChild={handleRemoveChild}
          />
        );
      case 'applications':
        return (
          <ApplicationManagement
            applications={frontendApplications}
            onUpdateApplication={handleUpdateApplication}
          />
        );
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
        return (
          <EnhancedDashboard
            onQuickAction={handleQuickAction}
            onNavigate={handleNavigate}
            children={frontendChildren}
            applications={frontendApplications}
          />
        );
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
        <AIAssistant role="adoption" />
      </div>
    </>
  );
}
