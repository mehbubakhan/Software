import { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Lock,
  Shield,
  Eye,
  Clock,
  User,
  MapPin,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Share2,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: string;
  encrypted: boolean;
  virusScan: string;
  watermark: boolean;
  accessCount: number;
  expiryDate?: string;
  relatedTo?: string;
}

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [temporaryURL, setTemporaryURL] = useState('');

  // Mock access log data
  const accessLogs = [
    { id: 1, user: 'Admin User', action: 'Viewed', timestamp: '2026-06-03 10:30 AM', ipAddress: '192.168.1.105', device: 'Chrome on Windows' },
    { id: 2, user: 'Sarah Johnson', action: 'Downloaded', timestamp: '2026-06-03 09:15 AM', ipAddress: '192.168.1.142', device: 'Safari on MacOS' },
    { id: 3, user: 'Admin User', action: 'Verified', timestamp: '2026-06-02 03:45 PM', ipAddress: '192.168.1.105', device: 'Chrome on Windows' },
    { id: 4, user: 'Michael Chen', action: 'Viewed', timestamp: '2026-06-02 11:20 AM', ipAddress: '192.168.1.89', device: 'Firefox on Linux' },
    { id: 5, user: 'System', action: 'Virus Scan', timestamp: '2026-06-01 02:00 PM', ipAddress: 'Internal', device: 'Security Scanner' },
    { id: 6, user: 'Admin User', action: 'Uploaded', timestamp: '2026-06-01 01:55 PM', ipAddress: '192.168.1.105', device: 'Chrome on Windows' },
  ];

  const securityChecks = [
    { check: 'Encryption Status', result: document.encrypted ? 'AES-256 Encrypted' : 'Not Encrypted', status: document.encrypted ? 'pass' : 'fail', icon: Lock },
    { check: 'Virus Scan', result: document.virusScan, status: document.virusScan === 'Clean' ? 'pass' : 'warning', icon: Shield },
    { check: 'Watermark Applied', result: document.watermark ? 'Yes' : 'No', status: document.watermark ? 'pass' : 'info', icon: FileText },
    { check: 'Access Logging', result: 'Enabled', status: 'pass', icon: Eye },
    { check: 'File Integrity', result: 'Verified', status: 'pass', icon: CheckCircle },
  ];

  const generateTemporaryURL = () => {
    const url = `https://secure-docs.orphanage.gov/temp/${document.id}/${Math.random().toString(36).substring(7)}`;
    setTemporaryURL(url);
    toast.success('Temporary URL generated (valid for 1 hour)');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(temporaryURL);
    toast.success('URL copied to clipboard');
  };

  const handleDownload = () => {
    toast.success(`Downloading ${document.name}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50';
      case 'fail': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Viewed': return <Eye className="w-4 h-4" />;
      case 'Downloaded': return <Download className="w-4 h-4" />;
      case 'Verified': return <CheckCircle className="w-4 h-4" />;
      case 'Uploaded': return <FileText className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{document.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>ID: {document.id}</span>
                  <span>•</span>
                  <span>{document.type}</span>
                  <span>•</span>
                  <span>{document.size}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    document.status === 'Verified' ? 'bg-green-100 text-green-700' :
                    document.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    document.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {document.status}
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

          {/* Quick Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={generateTemporaryURL}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Generate Temp URL
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
              Document Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Security & Compliance
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Access Logs ({accessLogs.length})
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
                  <h3 className="text-lg font-semibold text-gray-900">Document Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-gray-900">{document.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">File Type</label>
                      <p className="text-gray-900">{document.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">File Size</label>
                      <p className="text-gray-900">{document.size}</p>
                    </div>
                    {document.relatedTo && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Related To</label>
                        <p className="text-blue-600 font-medium">{document.relatedTo}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upload Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Uploaded By</label>
                      <p className="text-gray-900">{document.uploadedBy}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Upload Date</label>
                      <p className="text-gray-900">{document.uploadDate}</p>
                    </div>
                    {document.expiryDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                        <p className={`font-medium ${
                          new Date(document.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {document.expiryDate}
                          {new Date(document.expiryDate) < new Date() && ' (Expired)'}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Views</label>
                      <p className="text-gray-900">{document.accessCount} times</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Preview Placeholder */}
              <div className="bg-gray-100 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Document Preview</p>
                <p className="text-sm text-gray-500 mt-2">
                  Preview for {document.type} files
                </p>
              </div>

              {/* Temporary URL Section */}
              {temporaryURL && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Temporary Access URL (Valid for 1 hour)
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={temporaryURL}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Checks</h3>
                <div className="space-y-3">
                  {securityChecks.map((check, index) => {
                    const Icon = check.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(check.status)}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <div>
                            <p className="font-medium">{check.check}</p>
                            <p className="text-sm opacity-80">{check.result}</p>
                          </div>
                        </div>
                        {check.status === 'pass' && <CheckCircle className="w-5 h-5" />}
                        {check.status === 'warning' && <AlertTriangle className="w-5 h-5" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Lock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">End-to-End Encryption</p>
                      <p className="text-sm text-gray-600">AES-256 encryption at rest and in transit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Malware Protection</p>
                      <p className="text-sm text-gray-600">Real-time virus and malware scanning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Access Monitoring</p>
                      <p className="text-sm text-gray-600">Complete audit trail of all access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Digital Watermark</p>
                      <p className="text-sm text-gray-600">Embedded security watermark</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Access Logs Tab */}
          {activeTab === 'logs' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access History</h3>
              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-white p-2 rounded-lg border border-gray-300">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-500">{log.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {log.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {log.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Monitor className="w-4 h-4" />
                          {log.device}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
