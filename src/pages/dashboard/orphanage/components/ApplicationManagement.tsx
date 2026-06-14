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

interface Application {
  id: string;
  parentName: string;
  childName: string;
  childId: string;
  applicationDate: string;
  status: string;
  compatibilityScore: number;
  priority: string;
  parentAge?: number;
  occupation?: string;
  income?: number;
  maritalStatus?: string;
  address?: string;
  familyMembers?: number;
  previousAdoptions?: number;
  phone?: string;
  email?: string;
  houseOwnership?: string;
  livingSpace?: string;
  motivation?: string;
  parentingExperience?: string;
  familySupport?: string;
}

export default function ApplicationManagement() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    compatibilityScore: '',
    dateRange: ''
  });

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { default: api } = await import('../../../../services/api');
        const res = await api.get('/adoption/applications');
        if (res.data && res.data.ok) {
          const backendApps = res.data.data.map((app: any) => ({
            id: app.id.toString(),
            parentName: app.parent_name || `Parent #${app.parent_id}`,
            childName: app.child_name || `Child #${app.child_id}`,
            childId: app.child_id?.toString(),
            applicationDate: new Date(app.created_at || Date.now()).toISOString().split('T')[0],
            status: app.application_status === 'under_review' ? 'Pending Initial Review' : 
                    app.application_status === 'approved' ? 'Approved - Initial Review' : 
                    app.application_status === 'rejected' ? 'Rejected' : 'Document Verification',
            compatibilityScore: app.compatibility_score || 0,
            priority: app.compatibility_score >= 90 ? 'High' : app.compatibility_score >= 75 ? 'Medium' : 'Low',
            parentAge: app.form_data?.parentAge || 0,
            occupation: app.form_data?.occupation || 'Not specified',
            income: app.form_data?.income || 0,
            maritalStatus: app.form_data?.maritalStatus || 'Not specified',
            address: app.form_data?.address || 'Not specified',
            familyMembers: app.form_data?.familyMembers || 0,
            previousAdoptions: app.form_data?.previousAdoptions || 0,
            phone: app.form_data?.phone || 'Not specified',
            email: app.form_data?.email || 'Not specified',
            houseOwnership: app.form_data?.houseOwnership || 'Not specified',
            livingSpace: app.form_data?.livingSpace || 'Not specified',
            motivation: app.form_data?.motivation || 'Not specified',
            parentingExperience: app.form_data?.parentingExperience || 'Not specified',
            familySupport: app.form_data?.familySupport || 'Not specified'
          }));
          setApplications(backendApps);
        }
      } catch (err) {
        console.error('Failed to fetch applications', err);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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

  const handleFilterChange = (key: string, value: string) => {
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

  const handleSelectApplication = (id: string) => {
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

  const handleUpdateApplication = (updatedApp: Application) => {
    setApplications(applications.map(app =>
      app.id === updatedApp.id ? updatedApp : app
    ));
  };

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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

  const getScoreColor = (score: number) => {
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
