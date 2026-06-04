import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';

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
<<<<<<< Updated upstream
  const { user } = useAuth() || {};
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);
=======
  const { user } = useAuth() || {}
  const [applicationStatus, setApplicationStatus] = useState('Evaluation Ongoing')
  const [children, setChildren] = useState([])
  const [applications, setApplications] = useState([])
  const [orphanage, setOrphanage] = useState(null)
  const [childForm, setChildForm] = useState({ child_name: '', age: '', gender: '', health_condition: '', interests: '', short_description: '' })
  const [savingChild, setSavingChild] = useState(false)
  const [viewApp, setViewApp] = useState(null)
  
  useEffect(() => {
    getChildren().then(res => setChildren(res.data.data)).catch(console.error)
    getApplications().then(res => setApplications(res.data.data)).catch(console.error)
    getMyOrphanage().then(res => setOrphanage(res.data.data)).catch(() => setOrphanage(null))
    
    if (window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        document.getElementById(hash.substring(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [])
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 md:flex">
      <Sidebar items={items} variant="adoption-workspace" />
      <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Adoption Module</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Welcome, {user?.name || 'Orphanage Manager'}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Manage verified orphanage workflows, child profiles, parent applications, bonding sessions, compatibility review, final approval, and post-adoption follow-up from one secure dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Total Children', children.length, 'violet', 'Active'],
            ['Available for Adoption', children.filter(c => c.adoption_status === 'available').length, 'green', 'Ready'],
            ['Pending Applications', applications.filter(a => ['pending', 'under_review'].includes(a.application_status)).length, 'yellow', 'Action Required'],
            ['Approved Applications', applications.filter(a => a.application_status === 'approved').length, 'green', 'Active'],
            ['Upcoming Meetings', meetups.length, 'violet', 'Active'],
            ['Complaints', 0, 'slate', 'No issues'],
          ].map(([label, value, tone, badge]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
              <div className="mt-3"><StatusBadge tone={tone}>{badge}</StatusBadge></div>
            </div>
          ))}
        </div>

        <Section id="verification" eyebrow="Step 1" title="Orphanage Registration & Verification">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3 text-sm text-slate-700">
              <p><strong>Organization:</strong> {orphanage?.orphanage_name || user?.name || 'Registered Orphanage'}</p>
              <p><strong>Verification status:</strong> {orphanage?.verification_status || 'Documents submitted and awaiting admin verification.'}</p>
              <p><strong>Security:</strong> Registration documents are restricted to admin and authorized reviewers.</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-4">
              <p className="font-bold text-slate-900">Required workflow</p>
              <p className="mt-2 text-sm text-slate-600">Document upload, admin verification, approval or rejection, and verified badge tracking.</p>
            </div>
          </div>
        </Section>

        <Section id="children" eyebrow="Step 2" title="Child Profile Management">
          <form onSubmit={handleCreateChild} className="mb-6 rounded-lg border border-cyan-100 bg-cyan-50 p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <input value={childForm.child_name} onChange={e => setChildForm({ ...childForm, child_name: e.target.value })} required className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400" placeholder="Child name" />
              <input value={childForm.age} onChange={e => setChildForm({ ...childForm, age: e.target.value })} required className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400" placeholder="Age" />
              <input value={childForm.gender} onChange={e => setChildForm({ ...childForm, gender: e.target.value })} required className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400" placeholder="Gender" />
              <input value={childForm.health_condition} onChange={e => setChildForm({ ...childForm, health_condition: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 md:col-span-2 xl:col-span-3" placeholder="Health condition" />
              <input value={childForm.interests} onChange={e => setChildForm({ ...childForm, interests: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 md:col-span-2 xl:col-span-3" placeholder="Interests" />
              <textarea value={childForm.short_description} onChange={e => setChildForm({ ...childForm, short_description: e.target.value })} required className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 md:col-span-2 xl:col-span-3" placeholder="Short description" />
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" disabled={savingChild} className="rounded-lg bg-violet-600 px-5 py-2 font-bold text-white hover:bg-violet-700 disabled:opacity-60">
                {savingChild ? 'Saving...' : 'Add Child Profile'}
              </button>
            </div>
          </form>

          <div className="grid gap-4 lg:grid-cols-3">
            {children.map(child => (
              <article key={child.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{child.child_name}</h3>
                    <p className="text-sm text-slate-600">ID: {child.id} - {child.age} - {child.gender}</p>
                  </div>
                  <StatusBadge tone={child.adoption_status === 'available' ? 'green' : child.adoption_status === 'under_review' ? 'yellow' : 'violet'}>{child.adoption_status}</StatusBadge>
                </div>
                <p className="mt-3 text-sm text-slate-700">{child.health_condition}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge>{child.interests}</StatusBadge>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">Short description: {child.short_description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="parents" eyebrow="Step 3" title="Parent Adoption Profiles">
          <div className="grid gap-4 lg:grid-cols-3">
            {parentProfiles.map(parent => (
              <article key={parent.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-950">{parent.name}</h3>
                  <StatusBadge tone={parent.status === 'Verified' ? 'green' : parent.status === 'Background Check' ? 'yellow' : 'red'}>{parent.status}</StatusBadge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{parent.background}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <p><strong>Financial stability:</strong> {parent.finance}</p>
                  <p><strong>Parenting preference:</strong> {parent.preference}</p>
                  <p><strong>Documents:</strong> Identity, family background, living condition, motivation letter</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="applications" eyebrow="Step 4" title="Adoption Application System">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {['Application', 'Parent', 'Child', 'Status', 'Internal Score', 'Actions'].map(head => (
                    <th key={head} className="px-4 py-3 font-bold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-bold text-slate-900">{app.id}</td>
                    <td className="px-4 py-3">{app.parent_name || 'Parent ID: ' + app.parent_id}</td>
                    <td className="px-4 py-3">{app.child_name || 'Child ID: ' + app.child_id}</td>
                    <td className="px-4 py-3">
                      <select 
                        value={app.application_status} 
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-violet-700 outline-none"
                      >
                        <option value="pending">pending</option>
                        <option value="under_review">under_review</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{app.compatibility_score || 0}%</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewApp(app)} className="text-xs text-violet-600 font-bold hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="meetups" eyebrow="Step 5" title="Meetup & Bonding Sessions">
          <div className="grid gap-3">
            {meetups.map(meetup => (
              <div key={`${meetup.child}-${meetup.session}`} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[100px_1fr_160px]">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Session</p>
                  <p className="text-2xl font-black text-violet-600">{meetup.session}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{meetup.parent} with {meetup.child}</p>
                  <p className="mt-1 text-sm text-slate-600">{meetup.note}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{meetup.date}</p>
                  <StatusBadge tone={meetup.attendance === 'Confirmed' ? 'green' : 'yellow'}>{meetup.attendance}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="evaluations" eyebrow="Steps 6-7" title="Parent Q&A and Child Observation Reports">
          <div className="grid gap-4 md:grid-cols-3">
            {evaluations.map(item => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-black text-slate-950">{item.value}</p>
                <h3 className="mt-2 font-bold text-slate-900">{item.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
            Evaluation forms capture comfort level, communication quality, attachment signs, anxiety indicators, interaction quality, and staff observations after every meetup.
          </div>
        </Section>

        <Section id="compatibility" eyebrow="Step 8" title="Compatibility Matching Dashboard">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold text-slate-900">{app.parent_name || 'Parent ID: ' + app.parent_id} and {app.child_name}</p>
                    <span className="font-black text-violet-700">{app.compatibility_score || 0}%</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-200">
                    <div className="h-3 rounded-full bg-violet-600" style={{ width: `${app.compatibility_score || 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="font-bold">Private scoring rule</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Compatibility is hidden from parents and visible only to orphanage managers and admins. Scores combine meetup interaction, parent feedback, child observations, emotional trend, and document readiness.
              </p>
            </div>
          </div>
        </Section>

        <Section id="approval" eyebrow="Step 9" title="Final Adoption Approval">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="mt-3 text-sm text-slate-600">Select an application in the table above to change its status. Once an application is approved, you can generate a final report.</p>
            </div>
            <button className="rounded-lg bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700">
              Generate Final Report
            </button>
          </div>
        </Section>

        <Section id="followups" eyebrow="Step 10" title="Post-Adoption Follow-up">
          <div className="grid gap-4 md:grid-cols-2">
            {followUps.map(({ title, detail }) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{detail}</p>
                <StatusBadge tone="green">Follow-up active</StatusBadge>
              </div>
            ))}
          </div>
        </Section>

        <Section id="documents" eyebrow="Security" title="Documentation, Privacy, and Notifications">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Secure Documents', 'Legal documents, identity papers, agreements, and reports are stored with restricted role access.'],
              ['Activity Logs', 'Admin and orphanage actions are tracked for audit, compliance, and suspicious activity review.'],
              ['Notifications', 'Meetup reminders, status changes, follow-up schedules, and emergency alerts are prepared here.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="analytics" eyebrow="Monitoring" title="Analytics & System Monitoring">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analytics.map(([title, value, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <h3 className="mt-2 font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="security" eyebrow="Advanced Features" title="Security & Privacy Controls">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Encrypted storage', 'Legal, identity, medical, and evaluation files are marked for encrypted document storage.'],
              ['Role-based access', 'Parents see their own application data; compatibility scoring stays visible only to orphanage and admin roles.'],
              ['Sensitive data masking', 'Child medical summaries and restricted media use privacy-safe visibility controls.'],
              ['Audit trail', 'Verification, approvals, observations, and document actions are prepared for activity logging.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="notifications" eyebrow="Realtime Updates" title="Notification Center">
          <div className="space-y-3">
            {notifications.map(([title, detail]) => (
              <div key={title} className="rounded-lg border-l-4 border-violet-500 bg-violet-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>

      {/* Application Details Modal */}
      {viewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-black text-slate-950">Application Details #{viewApp.id}</h2>
              <button onClick={() => setViewApp(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500 uppercase">Child Applied For</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{viewApp.child_name || `ID: ${viewApp.child_id}`}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500 uppercase">Current Status</p>
                  <p className="mt-1 text-lg font-black text-violet-700">{viewApp.application_status}</p>
                </div>
              </div>

              {viewApp.form_data ? (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Applicant Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500">Name:</span> <span className="font-semibold">{viewApp.form_data.firstName} {viewApp.form_data.lastName}</span></div>
                      <div><span className="text-slate-500">Email:</span> <span className="font-semibold">{viewApp.form_data.email}</span></div>
                      <div><span className="text-slate-500">Phone:</span> <span className="font-semibold">{viewApp.form_data.phone}</span></div>
                      <div><span className="text-slate-500">Marital Status:</span> <span className="font-semibold">{viewApp.form_data.maritalStatus}</span></div>
                      <div className="col-span-2"><span className="text-slate-500">Address:</span> <span className="font-semibold">{viewApp.form_data.street}, {viewApp.form_data.city}, {viewApp.form_data.state} {viewApp.form_data.zip}</span></div>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Household & Finances</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500">Occupation:</span> <span className="font-semibold">{viewApp.form_data.occupation}</span></div>
                      <div><span className="text-slate-500">Employer:</span> <span className="font-semibold">{viewApp.form_data.employer}</span></div>
                      <div><span className="text-slate-500">Income:</span> <span className="font-semibold">{viewApp.form_data.income}</span></div>
                      <div><span className="text-slate-500">Housing:</span> <span className="font-semibold">{viewApp.form_data.housingType}</span></div>
                      <div><span className="text-slate-500">Household Members:</span> <span className="font-semibold">{viewApp.form_data.householdMembers}</span></div>
                      <div><span className="text-slate-500">Pets:</span> <span className="font-semibold">{viewApp.form_data.pets}</span></div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Motivation & Experience</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-slate-500 block mb-1">Motivation for Adoption:</span>
                        <p className="font-semibold bg-slate-50 p-3 rounded-lg border border-slate-100">{viewApp.form_data.motivation}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Experience with Children:</span>
                        <p className="font-semibold bg-slate-50 p-3 rounded-lg border border-slate-100">{viewApp.form_data.experience || 'None provided.'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Character References:</span>
                        <p className="font-semibold bg-slate-50 p-3 rounded-lg border border-slate-100">{viewApp.form_data.references}</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Submitted Documents</h3>
                    <div className="space-y-2 text-sm">
                      {(viewApp.submitted_documents || []).map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">{doc.name}</span>
                          {doc.uploaded ? (
                            <a href={`http://localhost:5001/uploads/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline font-bold text-xs">
                              View File
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Missing</span>
                          )}
                        </div>
                      ))}
                      {(!viewApp.submitted_documents || viewApp.submitted_documents.length === 0) && (
                        <p className="text-slate-500 italic">No documents required or submitted yet.</p>
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center text-yellow-700">
                  <p className="font-bold">No detailed form data available for this application.</p>
                  <p className="text-sm mt-1">This application might have been created before the detailed wizard was implemented.</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setViewApp(null)} className="px-5 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
>>>>>>> Stashed changes
}
