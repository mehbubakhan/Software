import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  MessageCircle,
  Heart,
  Ban,
  Upload,
  Eye,
  Download,
  User,
  Home,
  DollarSign,
  Users,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationDetailsProps {
  application: any;
  onClose: () => void;
  onUpdate: (application: any) => void;
}

export default function ApplicationDetails({ application, onClose, onUpdate }: ApplicationDetailsProps) {
  const [activeTab, setActiveTab] = useState('parent-info');
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const documents = [
    { id: 1, name: 'National ID Card', type: 'NID', uploaded: true, date: '2024-05-10', status: 'Verified' },
    { id: 2, name: 'Passport', type: 'Passport', uploaded: true, date: '2024-05-10', status: 'Verified' },
    { id: 3, name: 'Marriage Certificate', type: 'Marriage Cert', uploaded: true, date: '2024-05-11', status: 'Verified' },
    { id: 4, name: 'Income Proof - Tax Returns', type: 'Income Proof', uploaded: true, date: '2024-05-12', status: 'Verified' },
    { id: 5, name: 'Police Clearance Certificate', type: 'Police Clearance', uploaded: true, date: '2024-05-13', status: 'Pending Verification' },
    { id: 6, name: 'Medical Certificate', type: 'Medical', uploaded: true, date: '2024-05-14', status: 'Verified' },
    { id: 7, name: 'Home Ownership Proof', type: 'Property', uploaded: true, date: '2024-05-15', status: 'Verified' }
  ];

  const tabs = [
    { id: 'parent-info', label: 'Parent Information' },
    { id: 'documents', label: 'Documents' },
    { id: 'home-environment', label: 'Home Environment' },
    { id: 'motivation', label: 'Motivation & Experience' }
  ];

  const actionButtons = [
    { id: 'approve-initial', label: 'Approve Initial Review', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', nextStatus: 'Approved - Initial Review' },
    { id: 'reject', label: 'Reject Application', icon: XCircle, color: 'bg-red-600 hover:bg-red-700', nextStatus: 'Rejected' },
    { id: 'request-info', label: 'Request More Information', icon: AlertCircle, color: 'bg-orange-600 hover:bg-orange-700', nextStatus: 'Information Requested' },
    { id: 'request-docs', label: 'Request New Documents', icon: Upload, color: 'bg-yellow-600 hover:bg-yellow-700', nextStatus: 'Documents Requested' },
    { id: 'schedule-interview', label: 'Schedule Interview', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700', nextStatus: 'Interview Scheduled' },
    { id: 'assign-counselling', label: 'Assign Counselling', icon: MessageCircle, color: 'bg-indigo-600 hover:bg-indigo-700', nextStatus: 'Counselling Phase' },
    { id: 'move-bonding', label: 'Move to Bonding', icon: Heart, color: 'bg-pink-600 hover:bg-pink-700', nextStatus: 'Approved - Trial Bonding' },
    { id: 'approve-adoption', label: 'Approve Adoption', icon: CheckCircle, color: 'bg-emerald-600 hover:bg-emerald-700', nextStatus: 'Approved - Final' },
    { id: 'suspend', label: 'Suspend Application', icon: Ban, color: 'bg-gray-600 hover:bg-gray-700', nextStatus: 'Suspended' }
  ];

  const handleAction = (action: any) => {
    setSelectedAction(action.id);
    setShowActionConfirm(true);
  };

  const confirmAction = () => {
    const action = actionButtons.find(a => a.id === selectedAction);
    if (!action) return;

    const updatedApplication = {
      ...application,
      status: action.nextStatus
    };

    onUpdate(updatedApplication);

    // Show success message
    const successMessages: { [key: string]: string } = {
      'approve-initial': `Application ${application.id} approved for initial review`,
      'reject': `Application ${application.id} has been rejected`,
      'request-info': 'Information request sent to applicant',
      'request-docs': 'Document request sent to applicant',
      'schedule-interview': 'Interview scheduled successfully',
      'assign-counselling': 'Assigned to counselling phase',
      'move-bonding': 'Moved to trial bonding phase',
      'approve-adoption': 'Adoption approved! Congratulations!',
      'suspend': 'Application suspended'
    };

    toast.success(successMessages[selectedAction] || 'Action completed successfully');

    // Save review log
    console.log('Review Log:', {
      applicationId: application.id,
      action: selectedAction,
      notes: actionNotes,
      timestamp: new Date().toISOString()
    });

    setShowActionConfirm(false);
    setActionNotes('');

    // If it's a final action, close the details view
    if (['approve-adoption', 'reject'].includes(selectedAction)) {
      setTimeout(() => onClose(), 1500);
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending Verification':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Applications
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
              application.status.includes('Approved') ? 'bg-green-100 text-green-700 border-green-300' :
              application.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-300' :
              'bg-yellow-100 text-yellow-700 border-yellow-300'
            }`}>
              {application.status}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.parentName}</h1>
            <p className="text-lg text-gray-600 mt-1">Application ID: {application.id}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-gray-600">
                <strong>Child:</strong> {application.childName}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Applied:</strong> {application.applicationDate}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Compatibility:</strong> <span className={
                  application.compatibilityScore >= 90 ? 'text-green-600 font-bold' :
                  application.compatibilityScore >= 80 ? 'text-blue-600 font-bold' :
                  'text-yellow-600 font-bold'
                }>{application.compatibilityScore}%</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              application.compatibilityScore >= 90 ? 'text-green-600' :
              application.compatibilityScore >= 80 ? 'text-blue-600' :
              application.compatibilityScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {application.compatibilityScore}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Match Score</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Application Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actionButtons.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className={`${action.color} text-white p-3 rounded-lg flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs text-center font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Parent Information Tab */}
          {activeTab === 'parent-info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1">{application.parentName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="text-gray-900 mt-1">{application.parentAge} years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Occupation</label>
                    <p className="text-gray-900 mt-1">{application.occupation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                    <p className="text-gray-900 mt-1">${application.income?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <p className="text-gray-900 mt-1">{application.maritalStatus}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900 mt-1">{application.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Family Members</label>
                    <p className="text-gray-900 mt-1">{application.familyMembers} members</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Previous Adoptions</label>
                    <p className="text-gray-900 mt-1">
                      {application.previousAdoptions === 0 ? 'None' : application.previousAdoptions}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900 mt-1">{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1">{application.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Uploaded Documents</h3>
                <button
                  onClick={() => toast.info('Request additional documents')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Request Documents
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-500">Uploaded: {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => toast.success(`Viewing ${doc.name}`)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toast.success(`Downloading ${doc.name}`)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Home Environment Tab */}
          {activeTab === 'home-environment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">House Ownership</label>
                    <p className="text-gray-900 mt-1">{application.houseOwnership}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Living Space</label>
                    <p className="text-gray-900 mt-1">{application.livingSpace}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Environment</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900">
                    Well-established family environment with strong support system. Home is located in a safe neighborhood with
                    excellent schools nearby. The property includes a large backyard suitable for children's activities.
                    Family maintains close relationships with extended family members who live in the area.
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Child Safety Conditions</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-2 text-gray-900">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Home has been childproofed with safety gates and outlet covers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Secure backyard with fencing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Smoke detectors and fire extinguishers installed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Safe neighborhood with low crime rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Emergency contact plan established</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Motivation & Experience Tab */}
          {activeTab === 'motivation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to adopt?
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{application.motivation}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parenting Experience
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{application.parentingExperience}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Support System
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{application.familySupport}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes & Observations
                </label>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Social Worker Assessment:</strong> The applicants demonstrate strong commitment to adoption and have
                    thoroughly prepared for this responsibility. They have completed all required training programs and show
                    genuine understanding of the challenges and rewards of adoption. Their financial stability and supportive
                    family environment make them excellent candidates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showActionConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Action</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to <strong>{actionButtons.find(a => a.id === selectedAction)?.label}</strong> for application <strong>{application.id}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes or comments..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionConfirm(false);
                  setActionNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
