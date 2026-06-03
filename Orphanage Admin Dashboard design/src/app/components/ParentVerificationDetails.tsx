import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  Ban,
  Shield,
  User,
  MapPin,
  DollarSign,
  FileCheck,
  Heart,
  Users,
  AlertOctagon,
  Copy,
  FileText,
  Eye,
  Flag
} from 'lucide-react';
import { toast } from 'sonner';

interface ParentVerificationDetailsProps {
  verificationCase: any;
  onClose: () => void;
  onUpdate: (verificationCase: any) => void;
}

export default function ParentVerificationDetails({ verificationCase, onClose, onUpdate }: ParentVerificationDetailsProps) {
  const [activeTab, setActiveTab] = useState('checklist');
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const verificationChecklist = [
    {
      id: 'identity',
      label: 'Identity Verification',
      icon: User,
      status: verificationCase.identityVerification,
      description: 'Verify government-issued ID matches application details',
      checks: [
        { name: 'ID Document Uploaded', status: 'Verified' },
        { name: 'Photo Match', status: verificationCase.identityVerification },
        { name: 'Name Match', status: 'Verified' },
        { name: 'Date of Birth Verification', status: 'Verified' }
      ]
    },
    {
      id: 'address',
      label: 'Address Verification',
      icon: MapPin,
      status: verificationCase.addressVerification,
      description: 'Confirm residential address through utility bills or documents',
      checks: [
        { name: 'Utility Bill Provided', status: verificationCase.addressVerification },
        { name: 'Address Match', status: verificationCase.addressVerification },
        { name: 'Residence Confirmation', status: verificationCase.addressVerification }
      ]
    },
    {
      id: 'income',
      label: 'Income Verification',
      icon: DollarSign,
      status: verificationCase.incomeVerification,
      description: 'Validate financial stability through tax returns and pay stubs',
      checks: [
        { name: 'Tax Returns Provided', status: verificationCase.incomeVerification },
        { name: 'Pay Stubs Verified', status: verificationCase.incomeVerification },
        { name: 'Income Level Adequate', status: verificationCase.incomeVerification },
        { name: 'Employment Verification', status: verificationCase.incomeVerification }
      ]
    },
    {
      id: 'criminal',
      label: 'Criminal Background Check',
      icon: Shield,
      status: verificationCase.criminalBackground,
      description: 'Review criminal history and clearance certificates',
      checks: [
        { name: 'Police Clearance Obtained', status: verificationCase.criminalBackground },
        { name: 'Background Check Completed', status: verificationCase.criminalBackground },
        { name: 'No Red Flags', status: verificationCase.criminalBackground }
      ]
    },
    {
      id: 'medical',
      label: 'Medical Verification',
      icon: Heart,
      status: verificationCase.medicalVerification,
      description: 'Review medical certificates and health status',
      checks: [
        { name: 'Medical Certificate Provided', status: verificationCase.medicalVerification },
        { name: 'Health Status Acceptable', status: verificationCase.medicalVerification },
        { name: 'No Critical Issues', status: verificationCase.medicalVerification }
      ]
    },
    {
      id: 'family',
      label: 'Family Verification',
      icon: Users,
      status: verificationCase.familyVerification,
      description: 'Verify family members and household information',
      checks: [
        { name: 'Family Members Listed', status: verificationCase.familyVerification },
        { name: 'Household Size Verified', status: verificationCase.familyVerification },
        { name: 'Family Support Confirmed', status: verificationCase.familyVerification }
      ]
    }
  ];

  const fraudDetectionResults = {
    duplicateAccounts: {
      detected: verificationCase.duplicateAccounts > 0,
      count: verificationCase.duplicateAccounts,
      severity: verificationCase.duplicateAccounts > 1 ? 'high' : 'medium',
      description: verificationCase.duplicateAccounts > 0
        ? `${verificationCase.duplicateAccounts} duplicate account(s) detected with matching email/phone`
        : 'No duplicate accounts detected'
    },
    fakeDocuments: {
      detected: verificationCase.fraudAlerts.includes('Fake ID Detected') || verificationCase.fraudAlerts.includes('Edited Documents'),
      severity: 'high',
      description: verificationCase.fraudAlerts.includes('Fake ID Detected')
        ? 'AI-powered analysis detected manipulated or fake ID documents'
        : verificationCase.fraudAlerts.includes('Edited Documents')
        ? 'Document editing or manipulation detected'
        : 'All documents appear authentic'
    },
    suspiciousIP: {
      detected: verificationCase.suspiciousActivity || verificationCase.fraudAlerts.includes('Suspicious IP Activity'),
      severity: 'medium',
      description: verificationCase.fraudAlerts.includes('Suspicious IP Activity')
        ? 'Login attempts from suspicious IP addresses or VPN detected'
        : 'IP activity appears normal',
      ipAddress: verificationCase.ipAddress
    },
    multipleApplications: {
      detected: verificationCase.fraudAlerts.includes('Multiple Applications'),
      severity: 'medium',
      description: verificationCase.fraudAlerts.includes('Multiple Applications')
        ? 'Multiple applications submitted for different children'
        : 'Single application on record'
    }
  };

  const actionButtons = [
    { id: 'approve', label: 'Approve Verification', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', nextStatus: 'Verified' },
    { id: 'reject', label: 'Reject Verification', icon: XCircle, color: 'bg-red-600 hover:bg-red-700', nextStatus: 'Rejected' },
    { id: 'request-reupload', label: 'Request Re-upload', icon: Upload, color: 'bg-yellow-600 hover:bg-yellow-700', nextStatus: 'Needs Correction' },
    { id: 'flag', label: 'Flag as Suspicious', icon: Flag, color: 'bg-orange-600 hover:bg-orange-700', nextStatus: 'Flagged' },
    { id: 'suspend', label: 'Suspend Account', icon: Ban, color: 'bg-gray-600 hover:bg-gray-700', nextStatus: 'Suspended' },
    { id: 'forward-admin', label: 'Forward to System Admin', icon: AlertOctagon, color: 'bg-purple-600 hover:bg-purple-700', nextStatus: 'Admin Review' }
  ];

  const tabs = [
    { id: 'checklist', label: 'Verification Checklist' },
    { id: 'fraud-detection', label: 'Fraud Detection' },
    { id: 'documents', label: 'Document Review' }
  ];

  const handleAction = (action: any) => {
    setSelectedAction(action.id);
    setShowActionConfirm(true);
  };

  const confirmAction = () => {
    const action = actionButtons.find(a => a.id === selectedAction);
    if (!action) return;

    const updatedCase = {
      ...verificationCase,
      verificationStatus: action.nextStatus
    };

    // Update verification statuses based on action
    if (selectedAction === 'approve') {
      updatedCase.identityVerification = 'Verified';
      updatedCase.addressVerification = 'Verified';
      updatedCase.incomeVerification = 'Verified';
      updatedCase.criminalBackground = 'Cleared';
      updatedCase.medicalVerification = 'Verified';
      updatedCase.familyVerification = 'Verified';
      updatedCase.documentsVerified = updatedCase.documentsUploaded;
    } else if (selectedAction === 'reject') {
      updatedCase.identityVerification = 'Failed';
    }

    onUpdate(updatedCase);

    const successMessages: { [key: string]: string } = {
      'approve': `Verification ${verificationCase.id} approved successfully`,
      'reject': `Verification ${verificationCase.id} rejected`,
      'request-reupload': 'Re-upload request sent to applicant',
      'flag': 'Case flagged for further investigation',
      'suspend': 'Account suspended pending investigation',
      'forward-admin': 'Case forwarded to system administrator'
    };

    toast.success(successMessages[selectedAction] || 'Action completed successfully');

    // Log the action
    console.log('Verification Action Log:', {
      verificationId: verificationCase.id,
      action: selectedAction,
      notes: actionNotes,
      timestamp: new Date().toISOString()
    });

    setShowActionConfirm(false);
    setActionNotes('');

    if (['approve', 'reject'].includes(selectedAction)) {
      setTimeout(() => onClose(), 1500);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
      case 'Cleared':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Pending':
      case 'Under Review':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Failed':
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
      case 'Cleared':
        return 'text-green-600';
      case 'Pending':
      case 'Under Review':
        return 'text-yellow-600';
      case 'Failed':
      case 'Rejected':
        return 'text-red-600';
      default:
        return 'text-orange-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
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
            Back to Verification List
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
              verificationCase.verificationStatus === 'Verified' ? 'bg-green-100 text-green-700 border-green-300' :
              verificationCase.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-700 border-red-300' :
              verificationCase.verificationStatus === 'Flagged' ? 'bg-orange-100 text-orange-700 border-orange-300' :
              'bg-yellow-100 text-yellow-700 border-yellow-300'
            }`}>
              {verificationCase.verificationStatus}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{verificationCase.parentName}</h1>
            <p className="text-lg text-gray-600 mt-1">Verification ID: {verificationCase.id}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-gray-600">
                <strong>Application:</strong> {verificationCase.applicationId}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Submitted:</strong> {verificationCase.submissionDate}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Documents:</strong> {verificationCase.documentsVerified}/{verificationCase.documentsUploaded} Verified
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              verificationCase.riskScore < 30 ? 'text-green-600' :
              verificationCase.riskScore < 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {verificationCase.riskScore}
            </div>
            <p className="text-sm text-gray-600 mt-1">Risk Score</p>
          </div>
        </div>
      </div>

      {/* Fraud Alerts Banner */}
      {verificationCase.fraudAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Fraud Alerts Detected</h3>
              <ul className="space-y-1">
                {verificationCase.fraudAlerts.map((alert: string, index: number) => (
                  <li key={index} className="text-sm text-red-800">• {alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Verification Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
          {/* Verification Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              {verificationChecklist.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          item.status === 'Verified' || item.status === 'Cleared' ? 'bg-green-100' :
                          item.status === 'Failed' || item.status === 'Rejected' ? 'bg-red-100' :
                          item.status === 'Suspicious' || item.status === 'Needs Correction' ? 'bg-orange-100' :
                          'bg-yellow-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            item.status === 'Verified' || item.status === 'Cleared' ? 'text-green-600' :
                            item.status === 'Failed' || item.status === 'Rejected' ? 'text-red-600' :
                            item.status === 'Suspicious' || item.status === 'Needs Correction' ? 'text-orange-600' :
                            'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="ml-16 space-y-2">
                      {item.checks.map((check, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-sm text-gray-700">{check.name}</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(check.status)}
                            <span className={`text-xs font-medium ${getStatusColor(check.status)}`}>
                              {check.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fraud Detection Tab */}
          {activeTab === 'fraud-detection' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">AI-Powered Fraud Detection</h3>
                <p className="text-sm text-blue-800">
                  Our system uses advanced algorithms to detect fraudulent activities, duplicate accounts,
                  fake documents, and suspicious behavior patterns.
                </p>
              </div>

              {/* Duplicate Accounts */}
              <div className={`rounded-lg p-5 border-2 ${
                fraudDetectionResults.duplicateAccounts.detected
                  ? 'bg-red-50 border-red-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-start gap-3">
                  <Copy className={`w-6 h-6 ${
                    fraudDetectionResults.duplicateAccounts.detected ? 'text-red-600' : 'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Duplicate Accounts Check</h3>
                      {fraudDetectionResults.duplicateAccounts.detected && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          getSeverityColor(fraudDetectionResults.duplicateAccounts.severity)
                        }`}>
                          {fraudDetectionResults.duplicateAccounts.severity.toUpperCase()} RISK
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      fraudDetectionResults.duplicateAccounts.detected ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {fraudDetectionResults.duplicateAccounts.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fake Documents */}
              <div className={`rounded-lg p-5 border-2 ${
                fraudDetectionResults.fakeDocuments.detected
                  ? 'bg-red-50 border-red-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-start gap-3">
                  <FileText className={`w-6 h-6 ${
                    fraudDetectionResults.fakeDocuments.detected ? 'text-red-600' : 'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Document Authenticity Check</h3>
                      {fraudDetectionResults.fakeDocuments.detected && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          getSeverityColor(fraudDetectionResults.fakeDocuments.severity)
                        }`}>
                          {fraudDetectionResults.fakeDocuments.severity.toUpperCase()} RISK
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      fraudDetectionResults.fakeDocuments.detected ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {fraudDetectionResults.fakeDocuments.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suspicious IP */}
              <div className={`rounded-lg p-5 border-2 ${
                fraudDetectionResults.suspiciousIP.detected
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-start gap-3">
                  <Shield className={`w-6 h-6 ${
                    fraudDetectionResults.suspiciousIP.detected ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">IP Activity Analysis</h3>
                      {fraudDetectionResults.suspiciousIP.detected && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          getSeverityColor(fraudDetectionResults.suspiciousIP.severity)
                        }`}>
                          {fraudDetectionResults.suspiciousIP.severity.toUpperCase()} RISK
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      fraudDetectionResults.suspiciousIP.detected ? 'text-yellow-800' : 'text-green-800'
                    }`}>
                      {fraudDetectionResults.suspiciousIP.description}
                    </p>
                    {fraudDetectionResults.suspiciousIP.ipAddress && (
                      <p className="text-xs text-gray-600 mt-2">
                        IP Address: <code className="bg-gray-200 px-2 py-1 rounded">{fraudDetectionResults.suspiciousIP.ipAddress}</code>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Multiple Applications */}
              <div className={`rounded-lg p-5 border-2 ${
                fraudDetectionResults.multipleApplications.detected
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-6 h-6 ${
                    fraudDetectionResults.multipleApplications.detected ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Multiple Applications Check</h3>
                      {fraudDetectionResults.multipleApplications.detected && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          getSeverityColor(fraudDetectionResults.multipleApplications.severity)
                        }`}>
                          {fraudDetectionResults.multipleApplications.severity.toUpperCase()} RISK
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      fraudDetectionResults.multipleApplications.detected ? 'text-yellow-800' : 'text-green-800'
                    }`}>
                      {fraudDetectionResults.multipleApplications.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Review Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Document Review</h3>
                <button
                  onClick={() => toast.info('Opening AI document analyzer...')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  AI Document Analysis
                </button>
              </div>

              {[
                { name: 'National ID Card', status: verificationCase.identityVerification, type: 'Identity' },
                { name: 'Address Proof', status: verificationCase.addressVerification, type: 'Address' },
                { name: 'Income Tax Returns', status: verificationCase.incomeVerification, type: 'Income' },
                { name: 'Police Clearance', status: verificationCase.criminalBackground, type: 'Criminal' },
                { name: 'Medical Certificate', status: verificationCase.medicalVerification, type: 'Medical' },
                { name: 'Family Registration', status: verificationCase.familyVerification, type: 'Family' }
              ].map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-500">{doc.type} Verification</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <button
                      onClick={() => toast.success(`Viewing ${doc.name}`)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
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
              Are you sure you want to <strong>{actionButtons.find(a => a.id === selectedAction)?.label}</strong> for verification <strong>{verificationCase.id}</strong>?
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
