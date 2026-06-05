import { exportToCSV } from '../../../../utils/exportUtils';
import { useState, useEffect } from 'react';
import {
  Filter,
  Download,
  Calendar,
  CheckCircle,
  Search,
  Eye,
  ChevronDown,
  Users,
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';
import ApplicationDetails from './ApplicationDetails';
import { toast } from 'sonner';



export default function ApplicationManagement({ applications: propApplications, onUpdateApplication }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    compatibilityScore: '',
    dateRange: ''
  });

  const [applications, setApplications] = useState(propApplications || [
    {
      id: 'APP-2024-001',
      parentName: 'John & Mary Smith',
      childName: 'Emily Rose',
      childId: 'CH001',
      applicationDate: '2024-05-15',
      status: 'Pending Initial Review',
      compatibilityScore: 92,
      priority: 'High',
      parentAge: 35,
      occupation: 'Software Engineer & Teacher',
      income: 125000,
      maritalStatus: 'Married',
      address: '123 Oak Street, Springfield, IL 62701',
      familyMembers: 2,
      previousAdoptions: 0,
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      houseOwnership: 'Owned',
      livingSpace: '2500 sq ft, 4 bedrooms',
      motivation: 'We have always dreamed of having a family and want to provide a loving home to a child in need.',
      parentingExperience: 'No biological children, but extensive experience with nieces and nephews.',
      familySupport: 'Strong family support from both sides, grandparents eager to help.'
    },
    {
      id: 'APP-2024-002',
      parentName: 'David & Sarah Williams',
      childName: 'Michael James',
      childId: 'CH002',
      applicationDate: '2024-05-20',
      status: 'Interview Scheduled',
      compatibilityScore: 88,
      priority: 'High',
      parentAge: 38,
      occupation: 'Doctor & Nurse',
      income: 185000,
      maritalStatus: 'Married',
      address: '456 Maple Avenue, Chicago, IL 60601',
      familyMembers: 3,
      previousAdoptions: 0,
      phone: '+1 (555) 234-5678',
      email: 'david.williams@email.com',
      houseOwnership: 'Owned',
      livingSpace: '3000 sq ft, 5 bedrooms',
      motivation: 'We want to expand our family and give a child the opportunity for a better life.',
      parentingExperience: 'We have one biological child (age 8) and are experienced parents.',
      familySupport: 'Excellent support network including family and close friends.'
    },
    {
      id: 'APP-2024-003',
      parentName: 'Robert & Lisa Martinez',
      childName: 'Sarah Ann',
      childId: 'CH003',
      applicationDate: '2024-05-25',
      status: 'Counselling Phase',
      compatibilityScore: 95,
      priority: 'High',
      parentAge: 40,
      occupation: 'Business Owner & Accountant',
      income: 150000,
      maritalStatus: 'Married',
      address: '789 Pine Road, Boston, MA 02101',
      familyMembers: 2,
      previousAdoptions: 1,
      phone: '+1 (555) 345-6789',
      email: 'robert.martinez@email.com',
      houseOwnership: 'Owned',
      livingSpace: '2800 sq ft, 4 bedrooms',
      motivation: 'After successfully adopting our first child, we want to provide the same opportunity to another child.',
      parentingExperience: 'Experienced adoptive parents with one adopted child (age 6).',
      familySupport: 'Very strong support system, experienced with adoption process.'
    },
    {
      id: 'APP-2024-004',
      parentName: 'James & Patricia Brown',
      childName: 'David Lee',
      childId: 'CH004',
      applicationDate: '2024-06-01',
      status: 'Document Verification',
      compatibilityScore: 85,
      priority: 'Medium',
      parentAge: 42,
      occupation: 'Engineer & Lawyer',
      income: 200000,
      maritalStatus: 'Married',
      address: '321 Elm Street, Seattle, WA 98101',
      familyMembers: 2,
      previousAdoptions: 0,
      phone: '+1 (555) 456-7890',
      email: 'james.brown@email.com',
      houseOwnership: 'Owned',
      livingSpace: '3500 sq ft, 5 bedrooms',
      motivation: 'We are unable to have biological children and wish to build our family through adoption.',
      parentingExperience: 'No children yet, but have completed parenting courses and workshops.',
      familySupport: 'Strong family support, financially stable.'
    },
    {
      id: 'APP-2024-005',
      parentName: 'Michael & Jennifer Davis',
      childName: 'Olivia Grace',
      childId: 'CH005',
      applicationDate: '2024-06-02',
      status: 'Rejected',
      compatibilityScore: 65,
      priority: 'Low',
      parentAge: 28,
      occupation: 'Retail Manager & Sales',
      income: 55000,
      maritalStatus: 'Married',
      address: '654 Birch Lane, Denver, CO 80201',
      familyMembers: 2,
      previousAdoptions: 0,
      phone: '+1 (555) 567-8901',
      email: 'michael.davis@email.com',
      houseOwnership: 'Rented',
      livingSpace: '1200 sq ft, 2 bedrooms',
      motivation: 'We want to start a family.',
      parentingExperience: 'No experience with children.',
      familySupport: 'Limited family support.'
    },
    {
      id: 'APP-2024-006',
      parentName: 'Thomas & Emily Anderson',
      childName: 'Jacob Thomas',
      childId: 'CH006',
      applicationDate: '2024-05-28',
      status: 'Approved - Trial Bonding',
      compatibilityScore: 97,
      priority: 'High',
      parentAge: 36,
      occupation: 'Professor & Therapist',
      income: 140000,
      maritalStatus: 'Married',
      address: '987 Cedar Court, Portland, OR 97201',
      familyMembers: 2,
      previousAdoptions: 0,
      phone: '+1 (555) 678-9012',
      email: 'thomas.anderson@email.com',
      houseOwnership: 'Owned',
      livingSpace: '2600 sq ft, 4 bedrooms',
      motivation: 'We have a deep desire to provide a nurturing home and excellent education to a child.',
      parentingExperience: 'Both work with children professionally and have completed foster care training.',
      familySupport: 'Excellent support from extended family and professional network.'
    }
  ]);

  useEffect(() => {
    if (propApplications) {
      setApplications(propApplications);
    }
  }, [propApplications]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.childName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || app.status === filters.status;
    const matchesPriority = !filters.priority || app.priority === filters.priority;
    const matchesScore = !filters.compatibilityScore ||
      (filters.compatibilityScore === '90+' && app.compatibilityScore >= 90) ||
      (filters.compatibilityScore === '80-89' && app.compatibilityScore >= 80 && app.compatibilityScore < 90) ||
      (filters.compatibilityScore === '70-79' && app.compatibilityScore >= 70 && app.compatibilityScore < 80) ||
      (filters.compatibilityScore === '<70' && app.compatibilityScore < 70);

    return matchesSearch && matchesStatus && matchesPriority && matchesScore;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      compatibilityScore: '',
      dateRange: ''
    });
  };

  const handleSelectApplication = (id) => {
    setSelectedApplications(prev =>
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedApplications.length === 0) {
      toast.error('Please select applications to approve');
      return;
    }

    setApplications(applications.map(app =>
      selectedApplications.includes(app.id)
        ? { ...app, status: 'Approved - Initial Review' }
        : app
    ));

    toast.success(`${selectedApplications.length} application(s) approved`);
    setSelectedApplications([]);
  };

  const handleExportApplications = () => {
    toast.success('Exporting applications to CSV...');
    setTimeout(() => {
      toast.success('Applications exported successfully!');
    }, 1500);
  };

  const handleUpdateApplication = (updatedApp) => {
    if (onUpdateApplication) {
      onUpdateApplication(updatedApp);
    } else {
      setApplications(applications.map(app =>
        app.id === updatedApp.id ? updatedApp : app
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Initial Review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Approved - Initial Review':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Document Verification':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Counselling Phase':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'Approved - Trial Bonding':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 font-bold';
    if (score >= 80) return 'text-blue-600 font-bold';
    if (score >= 70) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  if (selectedApplication) {
    return (
      <ApplicationDetails
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdate={handleUpdateApplication}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
        <p className="text-gray-600 mt-1">Review and manage adoption applications</p>
      </div>

      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'Pending Initial Review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status.includes('Approved')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter Applications
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => exportToCSV([], 'data_export.csv')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Applications
          </button>
          <button
            onClick={() => toast.info('Schedule Interview feature')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Schedule Interview
          </button>
          <button
            onClick={handleBulkApprove}
            disabled={selectedApplications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Bulk Approve ({selectedApplications.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by parent name, application ID, or child name..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Pending Initial Review">Pending Initial Review</option>
                <option value="Approved - Initial Review">Approved - Initial Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Document Verification">Document Verification</option>
                <option value="Counselling Phase">Counselling Phase</option>
                <option value="Approved - Trial Bonding">Approved - Trial Bonding</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compatibility Score</label>
              <select
                value={filters.compatibilityScore}
                onChange={(e) => handleFilterChange('compatibilityScore', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Scores</option>
                <option value="90+">90-100 (Excellent)</option>
                <option value="80-89">80-89 (Good)</option>
                <option value="70-79">70-79 (Fair)</option>
                <option value="<70">&lt;70 (Poor)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compatibility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleSelectApplication(app.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{app.parentName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.childName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            app.compatibilityScore >= 90 ? 'bg-green-500' :
                            app.compatibilityScore >= 80 ? 'bg-blue-500' :
                            app.compatibilityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${app.compatibilityScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm ${getScoreColor(app.compatibilityScore)}`}>
                        {app.compatibilityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(app.priority)}`}>
                      {app.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredApplications.length}</span> of{' '}
            <span className="font-medium">{applications.length}</span> applications
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              2
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
