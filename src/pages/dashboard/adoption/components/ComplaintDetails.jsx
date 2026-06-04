import { useState } from 'react';
import {
  X,
  AlertTriangle,
  Shield,
  FileText,
  Image,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserX,
  Send,
  Flag,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';





export default function ComplaintDetails({ complaint, onClose, onUpdate, onDelete }) {
  const [activeTab, setActiveTab] = useState('details');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [investigationNotes, setInvestigationNotes] = useState([
    { id: 1, user: 'Admin Officer', note: 'Initial review completed. Evidence appears credible.', timestamp: '2026-06-03 10:30 AM' },
    { id: 2, user: 'Legal Team', note: 'Cross-checking documents with official records.', timestamp: '2026-06-03 11:45 AM' }
  ]);

  const mockScreenshots = [
    { id: 1, name: 'Screenshot_1.png', size: '245 KB' },
    { id: 2, name: 'Screenshot_2.png', size: '312 KB' },
    { id: 3, name: 'Screenshot_3.png', size: '189 KB' }
  ];

  const handleAction = (action) => {
    setSelectedAction(action);
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!actionNotes.trim()) {
      toast.error('Please provide notes for this action');
      return;
    }

    let updatedComplaint = { ...complaint };

    switch (selectedAction) {
      case 'warn':
        toast.warning('Warning sent to parent');
        updatedComplaint.status = 'Under Review';
        break;
      case 'suspend':
        toast.error('Application suspended');
        updatedComplaint.status = 'Escalated';
        break;
      case 'forward':
        toast.info('Complaint forwarded to System Admin');
        updatedComplaint.status = 'Escalated';
        updatedComplaint.assignedTo = 'System Administrator';
        break;
      case 'close':
        toast.success('Complaint closed');
        updatedComplaint.status = 'Closed';
        break;
      case 'investigate':
        toast.info('Investigation requested');
        updatedComplaint.status = 'Under Review';
        break;
      case 'emergency':
        toast.error('Emergency escalation activated!');
        updatedComplaint.status = 'Escalated';
        updatedComplaint.priority = 'Critical';
        updatedComplaint.assignedTo = 'Emergency Response Team';
        break;
    }

    // Add note
    setInvestigationNotes([
      {
        id: investigationNotes.length + 1,
        user: 'Current User',
        note: actionNotes,
        timestamp: new Date().toLocaleString()
      },
      ...investigationNotes
    ]);

    onUpdate(updatedComplaint);
    setShowActionModal(false);
    setActionNotes('');
  };

  const handleDownloadEvidence = (fileName) => {
    toast.success(`Downloading ${fileName}...`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      onDelete(complaint.id);
      toast.success('Complaint deleted');
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'warn': return <AlertCircle className="w-5 h-5" />;
      case 'suspend': return <UserX className="w-5 h-5" />;
      case 'forward': return <Send className="w-5 h-5" />;
      case 'close': return <CheckCircle className="w-5 h-5" />;
      case 'investigate': return <Shield className="w-5 h-5" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'warn': return 'Warn Parent';
      case 'suspend': return 'Suspend Application';
      case 'forward': return 'Forward to Admin';
      case 'close': return 'Close Complaint';
      case 'investigate': return 'Request Investigation';
      case 'emergency': return 'Emergency Escalation';
      default: return action;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{complaint.subject}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>ID: {complaint.id}</span>
                  <span>•</span>
                  <span>{complaint.type}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    complaint.priority === 'Critical' ? 'bg-red-600 text-white' :
                    complaint.priority === 'High' ? 'bg-orange-600 text-white' :
                    complaint.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {complaint.priority} Priority
                  </span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                    complaint.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    complaint.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <button
              onClick={() => handleAction('warn')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              Warn Parent
            </button>
            <button
              onClick={() => handleAction('suspend')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <UserX className="w-4 h-4" />
              Suspend App
            </button>
            <button
              onClick={() => handleAction('forward')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              Forward
            </button>
            <button
              onClick={() => handleAction('close')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Close
            </button>
            <button
              onClick={() => handleAction('investigate')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Shield className="w-4 h-4" />
              Investigate
            </button>
            <button
              onClick={() => handleAction('emergency')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Complaint Details
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'evidence'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Evidence ({complaint.evidence.length})
            </button>
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'screenshots'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Screenshots ({complaint.screenshots})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Investigation Notes ({investigationNotes.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reporter Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{complaint.reporter}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{complaint.reporterEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{complaint.reporterPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Reported Date</label>
                      <p className="text-gray-900">{complaint.reportedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complaint Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Reported Against</label>
                      <p className="text-gray-900 font-medium">{complaint.reportedAgainst}</p>
                    </div>
                    {complaint.relatedApplication && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Related Application</label>
                        <p className="text-blue-600 font-medium">{complaint.relatedApplication}</p>
                      </div>
                    )}
                    {complaint.relatedChild && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Related Child</label>
                        <p className="text-purple-600 font-medium">{complaint.relatedChild}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
                      <p className="text-gray-900">{complaint.assignedTo || 'Pending Assignment'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Files</h3>
              <div className="space-y-3">
                {complaint.evidence.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file}</p>
                        <p className="text-sm text-gray-500">Uploaded on {complaint.reportedDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadEvidence(file)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots Tab */}
          {activeTab === 'screenshots' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Screenshots</h3>
              <div className="grid grid-cols-3 gap-4">
                {mockScreenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="bg-gray-100 aspect-video flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-sm font-medium text-gray-900">{screenshot.name}</p>
                      <p className="text-xs text-gray-500">{screenshot.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigation Notes</h3>
              <div className="space-y-3">
                {investigationNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{note.user}</p>
                          <p className="text-sm text-gray-500">{note.timestamp}</p>
                        </div>
                        <p className="text-gray-700">{note.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete Complaint
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                {getActionIcon(selectedAction)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{getActionLabel(selectedAction)}</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
                placeholder="Provide details about this action..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
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
