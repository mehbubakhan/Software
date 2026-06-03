import { useState } from 'react';
import {
  FileText,
  Upload,
  Eye,
  Download,
  Archive,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  FileCheck,
  Folder
} from 'lucide-react';
import { toast } from 'sonner';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentViewer from './DocumentViewer';



export default function DocumentManagement() {
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-001',
      name: 'John_Smith_NID.pdf',
      category: 'Parent Documents',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Admin User',
      uploadDate: '2026-05-28',
      status: 'Verified',
      encrypted: true,
      virusScan: 'Clean',
      watermark: true,
      accessCount: 12,
      expiryDate: '2027-05-28',
      relatedTo: 'APP-2024-001'
    },
    {
      id: 'DOC-002',
      name: 'Child_Medical_Report_CH045.pdf',
      category: 'Child Reports',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: '2026-06-01',
      status: 'Verified',
      encrypted: true,
      virusScan: 'Clean',
      watermark: true,
      accessCount: 8,
      relatedTo: 'CH045'
    },
    {
      id: 'DOC-003',
      name: 'Income_Certificate.jpg',
      category: 'Parent Documents',
      type: 'JPG',
      size: '850 KB',
      uploadedBy: 'Mary Williams',
      uploadDate: '2026-06-02',
      status: 'Pending',
      encrypted: true,
      virusScan: 'Scanning',
      watermark: false,
      accessCount: 3,
      relatedTo: 'APP-2024-003'
    },
    {
      id: 'DOC-004',
      name: 'Adoption_Agreement_Draft.docx',
      category: 'Legal Documents',
      type: 'DOCX',
      size: '450 KB',
      uploadedBy: 'Legal Officer',
      uploadDate: '2026-05-30',
      status: 'Verified',
      encrypted: true,
      virusScan: 'Clean',
      watermark: true,
      accessCount: 15,
      expiryDate: '2026-12-30',
      relatedTo: 'APP-2024-002'
    },
    {
      id: 'DOC-005',
      name: 'Counselling_Session_Report.pdf',
      category: 'Counselling Reports',
      type: 'PDF',
      size: '1.2 MB',
      uploadedBy: 'Dr. Michael Chen',
      uploadDate: '2026-06-03',
      status: 'Verified',
      encrypted: true,
      virusScan: 'Clean',
      watermark: true,
      accessCount: 5,
      relatedTo: 'MEET-2024-015'
    },
    {
      id: 'DOC-006',
      name: 'Medical_Certificate_Expired.pdf',
      category: 'Medical Records',
      type: 'PDF',
      size: '680 KB',
      uploadedBy: 'Clinic Staff',
      uploadDate: '2025-12-15',
      status: 'Expired',
      encrypted: true,
      virusScan: 'Clean',
      watermark: true,
      accessCount: 20,
      expiryDate: '2026-05-15',
      relatedTo: 'CH032'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const categories = [
    'All',
    'Parent Documents',
    'Child Reports',
    'Medical Records',
    'Legal Documents',
    'Counselling Reports',
    'Meeting Reports'
  ];

  const statusOptions = ['All', 'Verified', 'Pending', 'Rejected', 'Expired'];

  const statistics = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'Verified').length,
    pending: documents.filter(d => d.status === 'Pending').length,
    encrypted: documents.filter(d => d.encrypted).length
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.relatedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleVerifyDocument = (docId) => {
    setDocuments(documents.map(doc =>
      doc.id === docId ? { ...doc, status: 'Verified', virusScan: 'Clean' } : doc
    ));
    toast.success('Document verified successfully');
  };

  const handleRejectDocument = (docId) => {
    setDocuments(documents.map(doc =>
      doc.id === docId ? { ...doc, status: 'Rejected' } : doc
    ));
    toast.error('Document rejected');
  };

  const handleDownloadDocument = (doc) => {
    toast.success(`Downloading ${doc.name}...`);
    // Log access
    setDocuments(documents.map(d =>
      d.id === doc.id ? { ...d, accessCount: d.accessCount + 1 } : d
    ));
  };

  const handleArchiveDocument = (docId) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast.success('Document archived successfully');
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowViewer(true);
    // Log access
    setDocuments(documents.map(d =>
      d.id === doc.id ? { ...d, accessCount: d.accessCount + 1 } : d
    ));
  };

  const handleUploadComplete = (newDocument) => {
    const doc = {
      id: `DOC-${String(documents.length + 1).padStart(3, '0')}`,
      name: newDocument.fileName,
      category: newDocument.category,
      type: newDocument.fileType,
      size: newDocument.fileSize,
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      encrypted: newDocument.encryption,
      virusScan: 'Scanning',
      watermark: newDocument.watermark,
      accessCount: 0,
      relatedTo: newDocument.relatedTo
    };
    setDocuments([doc, ...documents]);
    toast.success('Document uploaded successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-300';
      case 'Expired': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Parent Documents': return '👨‍👩‍👧';
      case 'Child Reports': return '👶';
      case 'Medical Records': return '🏥';
      case 'Legal Documents': return '⚖️';
      case 'Counselling Reports': return '💬';
      case 'Meeting Reports': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
        <p className="text-gray-600 mt-1">Manage all adoption-related files and documents</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.total}</h3>
          <p className="text-sm text-gray-600">Total Documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-500 p-3 rounded-lg">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.verified}</h3>
          <p className="text-sm text-gray-600">Verified</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.pending}</h3>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.encrypted}</h3>
          <p className="text-sm text-gray-600">Encrypted Files</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Documents</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, ID, or related entity..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload New Document
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Document Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Upload Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Security</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">ID: {doc.id}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(doc.category)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.category}</p>
                        {doc.relatedTo && (
                          <p className="text-xs text-gray-500">Related: {doc.relatedTo}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{doc.uploadedBy}</p>
                    <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                    {doc.expiryDate && (
                      <p className="text-xs text-orange-600">Expires: {doc.expiryDate}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        {doc.encrypted ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Encrypted
                          </span>
                        ) : (
                          <span className="text-red-600">Not Encrypted</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {doc.virusScan === 'Clean' ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Clean
                          </span>
                        ) : (
                          <span className="text-yellow-600">{doc.virusScan}</span>
                        )}
                      </div>
                      {doc.watermark && (
                        <div className="text-xs text-blue-600">Watermarked</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{doc.accessCount} views</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {doc.status === 'Pending' && (
                        <button
                          onClick={() => handleVerifyDocument(doc.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Verify Document"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {doc.status === 'Pending' && (
                        <button
                          onClick={() => handleRejectDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Document"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchiveDocument(doc.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Archive Document"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No documents found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or upload a new document</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadComplete}
        />
      )}

      {showViewer && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => {
            setShowViewer(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}
