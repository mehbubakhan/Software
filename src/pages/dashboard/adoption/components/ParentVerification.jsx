import { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import ParentVerificationDetails from './ParentVerificationDetails';
import { toast } from 'sonner';



export default function ParentVerification() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    riskLevel: '',
    verificationType: ''
  });

  const [verificationCases, setVerificationCases] = useState([
    {
      id: 'VER-001',
      parentName: 'John & Mary Smith',
      applicationId: 'APP-2024-001',
      submissionDate: '2024-05-15',
      verificationStatus: 'Pending Verification',
      identityVerification: 'Pending',
      addressVerification: 'Pending',
      incomeVerification: 'Pending',
      criminalBackground: 'Pending',
      medicalVerification: 'Pending',
      familyVerification: 'Pending',
      fraudAlerts: [],
      riskScore: 15,
      documentsUploaded: 7,
      documentsVerified: 0,
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      ipAddress: '192.168.1.100',
      duplicateAccounts: 0,
      suspiciousActivity: false
    },
    {
      id: 'VER-002',
      parentName: 'David & Sarah Williams',
      applicationId: 'APP-2024-002',
      submissionDate: '2024-05-20',
      verificationStatus: 'Verified',
      identityVerification: 'Verified',
      addressVerification: 'Verified',
      incomeVerification: 'Verified',
      criminalBackground: 'Cleared',
      medicalVerification: 'Verified',
      familyVerification: 'Verified',
      fraudAlerts: [],
      riskScore: 5,
      documentsUploaded: 7,
      documentsVerified: 7,
      email: 'david.williams@email.com',
      phone: '+1 (555) 234-5678',
      ipAddress: '192.168.1.101',
      duplicateAccounts: 0,
      suspiciousActivity: false
    },
    {
      id: 'VER-003',
      parentName: 'Michael & Jennifer Davis',
      applicationId: 'APP-2024-005',
      submissionDate: '2024-06-02',
      verificationStatus: 'Flagged',
      identityVerification: 'Failed',
      addressVerification: 'Suspicious',
      incomeVerification: 'Under Review',
      criminalBackground: 'Pending',
      medicalVerification: 'Pending',
      familyVerification: 'Pending',
      fraudAlerts: ['Fake ID Detected', 'Edited Documents', 'Suspicious IP Activity'],
      riskScore: 85,
      documentsUploaded: 6,
      documentsVerified: 1,
      email: 'michael.davis@email.com',
      phone: '+1 (555) 567-8901',
      ipAddress: '45.123.45.67',
      duplicateAccounts: 2,
      suspiciousActivity: true
    },
    {
      id: 'VER-004',
      parentName: 'Robert & Lisa Martinez',
      applicationId: 'APP-2024-003',
      submissionDate: '2024-05-25',
      verificationStatus: 'Verified',
      identityVerification: 'Verified',
      addressVerification: 'Verified',
      incomeVerification: 'Verified',
      criminalBackground: 'Cleared',
      medicalVerification: 'Verified',
      familyVerification: 'Verified',
      fraudAlerts: [],
      riskScore: 3,
      documentsUploaded: 8,
      documentsVerified: 8,
      email: 'robert.martinez@email.com',
      phone: '+1 (555) 345-6789',
      ipAddress: '192.168.1.102',
      duplicateAccounts: 0,
      suspiciousActivity: false
    },
    {
      id: 'VER-005',
      parentName: 'James & Patricia Brown',
      applicationId: 'APP-2024-004',
      submissionDate: '2024-06-01',
      verificationStatus: 'Needs Correction',
      identityVerification: 'Verified',
      addressVerification: 'Needs Correction',
      incomeVerification: 'Needs Correction',
      criminalBackground: 'Cleared',
      medicalVerification: 'Verified',
      familyVerification: 'Pending',
      fraudAlerts: ['Income Document Mismatch'],
      riskScore: 35,
      documentsUploaded: 7,
      documentsVerified: 4,
      email: 'james.brown@email.com',
      phone: '+1 (555) 456-7890',
      ipAddress: '192.168.1.103',
      duplicateAccounts: 0,
      suspiciousActivity: false
    },
    {
      id: 'VER-006',
      parentName: 'Thomas & Emily Anderson',
      applicationId: 'APP-2024-006',
      submissionDate: '2024-05-28',
      verificationStatus: 'Verified',
      identityVerification: 'Verified',
      addressVerification: 'Verified',
      incomeVerification: 'Verified',
      criminalBackground: 'Cleared',
      medicalVerification: 'Verified',
      familyVerification: 'Verified',
      fraudAlerts: [],
      riskScore: 2,
      documentsUploaded: 7,
      documentsVerified: 7,
      email: 'thomas.anderson@email.com',
      phone: '+1 (555) 678-9012',
      ipAddress: '192.168.1.104',
      duplicateAccounts: 0,
      suspiciousActivity: false
    }
  ]);

  const filteredCases = verificationCases.filter(vCase => {
    const matchesSearch =
      vCase.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vCase.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vCase.applicationId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || vCase.verificationStatus === filters.status;

    const matchesRiskLevel = !filters.riskLevel ||
      (filters.riskLevel === 'low' && vCase.riskScore < 30) ||
      (filters.riskLevel === 'medium' && vCase.riskScore >= 30 && vCase.riskScore < 70) ||
      (filters.riskLevel === 'high' && vCase.riskScore >= 70);

    return matchesSearch && matchesStatus && matchesRiskLevel;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      riskLevel: '',
      verificationType: ''
    });
  };

  const handleUpdateCase = (updatedCase: VerificationCase) => {
    setVerificationCases(verificationCases.map(vCase =>
      vCase.id === updatedCase.id ? updatedCase : vCase
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Verification':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Verified':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Flagged':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Needs Correction':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getVerificationStatusColor = (status) => {
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
      case 'Needs Correction':
      case 'Suspicious':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskScoreBg = (score) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate statistics
  const stats = {
    pending: verificationCases.filter(v => v.verificationStatus === 'Pending Verification').length,
    verified: verificationCases.filter(v => v.verificationStatus === 'Verified').length,
    rejected: verificationCases.filter(v => v.verificationStatus === 'Rejected').length,
    flagged: verificationCases.filter(v => v.verificationStatus === 'Flagged').length
  };

  if (selectedCase) {
    return (
      <ParentVerificationDetails
        verificationCase={selectedCase}
        onClose={() => setSelectedCase(null)}
        onUpdate={handleUpdateCase}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Parent Verification</h1>
        <p className="text-gray-600 mt-1">Verify parent identity, legitimacy, and detect fraud</p>
      </div>

      {/* Verification Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter Verifications
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => toast.info('Running fraud detection scan...')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertOctagon className="w-4 h-4" />
            Run Fraud Detection
          </button>
          <button
            onClick={() => toast.success('Exporting verification reports...')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Export Reports
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by parent name, verification ID, or application ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Filter Options</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="Flagged">Flagged</option>
                <option value="Needs Correction">Needs Correction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
              <select
                value={filters.riskLevel}
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Risk Levels</option>
                <option value="low">Low Risk (&lt;30)</option>
                <option value="medium">Medium Risk (30-69)</option>
                <option value="high">High Risk (70+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Type</label>
              <select
                value={filters.verificationType}
                onChange={(e) => handleFilterChange('verificationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="identity">Identity Verification</option>
                <option value="address">Address Verification</option>
                <option value="income">Income Verification</option>
                <option value="criminal">Criminal Background</option>
                <option value="medical">Medical Verification</option>
                <option value="family">Family Verification</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Verification Cases Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Alerts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((vCase) => (
                <tr key={vCase.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vCase.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{vCase.parentName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vCase.applicationId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vCase.verificationStatus)}`}>
                      {vCase.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${getRiskScoreBg(vCase.riskScore)}`}
                          style={{ width: `${vCase.riskScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${getRiskScoreColor(vCase.riskScore)}`}>
                        {vCase.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`${vCase.documentsVerified === vCase.documentsUploaded ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                      {vCase.documentsVerified}/{vCase.documentsUploaded}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vCase.fraudAlerts.length > 0 ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-300">
                        {vCase.fraudAlerts.length} Alert{vCase.fraudAlerts.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">No alerts</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedCase(vCase)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No verification cases found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCases.length}</span> of{' '}
            <span className="font-medium">{verificationCases.length}</span> verification cases
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
