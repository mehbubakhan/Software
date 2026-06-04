import { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  FileX,
  UserX,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Flag
} from 'lucide-react';
import { toast } from 'sonner';
import FileComplaintModal from './FileComplaintModal';
import ComplaintDetails from './ComplaintDetails';

interface Complaint {
  id: string;
  type: string;
  priority: string;
  status: string;
  reporter: string;
  reporterEmail: string;
  reporterPhone: string;
  reportedAgainst: string;
  reportedDate: string;
  subject: string;
  description: string;
  evidence: string[];
  screenshots: number;
  assignedTo?: string;
  notes: number;
  relatedApplication?: string;
  relatedChild?: string;
}

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 'COMP-001',
      type: 'Fraud',
      priority: 'High',
      status: 'Under Review',
      reporter: 'Anonymous',
      reporterEmail: 'anonymous@system.com',
      reporterPhone: 'Not Provided',
      reportedAgainst: 'John Smith (APP-2024-007)',
      reportedDate: '2026-06-01',
      subject: 'Suspected Income Fraud',
      description: 'Income certificate appears to be forged. Numbers don\'t match employment verification.',
      evidence: ['Income Certificate.pdf', 'Employment Letter.pdf', 'Bank Statement.pdf'],
      screenshots: 3,
      assignedTo: 'Admin Officer',
      notes: 2,
      relatedApplication: 'APP-2024-007'
    },
    {
      id: 'COMP-002',
      type: 'Child Abuse',
      priority: 'Critical',
      status: 'Escalated',
      reporter: 'Dr. Sarah Johnson',
      reporterEmail: 'sarah.j@hospital.com',
      reporterPhone: '+1-555-0123',
      reportedAgainst: 'Foster Family - Williams',
      reportedDate: '2026-06-03',
      subject: 'Child Shows Signs of Neglect',
      description: 'During routine medical checkup, child showed signs of malnutrition and poor hygiene. Immediate investigation required.',
      evidence: ['Medical_Report.pdf', 'Photos.zip'],
      screenshots: 5,
      assignedTo: 'Emergency Response Team',
      notes: 4,
      relatedChild: 'CH032'
    },
    {
      id: 'COMP-003',
      type: 'Fake Documents',
      priority: 'High',
      status: 'Open',
      reporter: 'Verification Officer',
      reporterEmail: 'verify@orphanage.gov',
      reporterPhone: '+1-555-0199',
      reportedAgainst: 'Mary Williams (APP-2024-010)',
      reportedDate: '2026-06-02',
      subject: 'Forged Marriage Certificate',
      description: 'Marriage certificate shows inconsistencies with official records. Security features missing.',
      evidence: ['Marriage_Cert.jpg', 'Official_Comparison.pdf'],
      screenshots: 2,
      assignedTo: 'Legal Team',
      notes: 1,
      relatedApplication: 'APP-2024-010'
    },
    {
      id: 'COMP-004',
      type: 'Misconduct',
      priority: 'Medium',
      status: 'Under Review',
      reporter: 'Case Worker Team',
      reporterEmail: 'casework@orphanage.gov',
      reporterPhone: '+1-555-0145',
      reportedAgainst: 'Admin Staff - Robert Lee',
      reportedDate: '2026-05-30',
      subject: 'Inappropriate Communication',
      description: 'Staff member sent inappropriate messages to parent applicant outside working hours.',
      evidence: ['Chat_Logs.pdf', 'Screenshots.zip'],
      screenshots: 8,
      assignedTo: 'HR Department',
      notes: 3
    },
    {
      id: 'COMP-005',
      type: 'Harassment',
      priority: 'Medium',
      status: 'Closed',
      reporter: 'Jane Doe',
      reporterEmail: 'jane.doe@email.com',
      reporterPhone: '+1-555-0167',
      reportedAgainst: 'Unknown Individual',
      reportedDate: '2026-05-25',
      subject: 'Threatening Phone Calls',
      description: 'Received multiple threatening calls regarding adoption application. Resolved - caller identified and warned.',
      evidence: ['Call_Records.pdf'],
      screenshots: 0,
      assignedTo: 'Security Team',
      notes: 5
    },
    {
      id: 'COMP-006',
      type: 'Safety Concern',
      priority: 'High',
      status: 'Open',
      reporter: 'Neighbor',
      reporterEmail: 'concerned@email.com',
      reporterPhone: 'Anonymous',
      reportedAgainst: 'Trial Bonding - Chen Family',
      reportedDate: '2026-06-03',
      subject: 'Unsafe Home Environment',
      description: 'Neighbor reports unsafe living conditions and excessive noise/disturbance from trial bonding home.',
      evidence: ['Photos.zip', 'Audio_Recording.mp3'],
      screenshots: 6,
      assignedTo: 'Home Visit Team',
      notes: 1,
      relatedChild: 'CH045'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const complaintTypes = ['All', 'Fraud', 'Child Abuse', 'Fake Documents', 'Misconduct', 'Harassment', 'Safety Concern'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const statuses = ['All', 'Open', 'Under Review', 'Resolved', 'Closed', 'Escalated'];

  const statistics = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'Open').length,
    critical: complaints.filter(c => c.priority === 'Critical').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.reportedAgainst.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || complaint.type === selectedType;
    const matchesPriority = selectedPriority === 'All' || complaint.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || complaint.status === selectedStatus;
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  const handleFileComplaint = (newComplaint: any) => {
    const complaint: Complaint = {
      id: `COMP-${String(complaints.length + 1).padStart(3, '0')}`,
      type: newComplaint.type,
      priority: newComplaint.priority,
      status: 'Open',
      reporter: newComplaint.reporterName,
      reporterEmail: newComplaint.reporterEmail,
      reporterPhone: newComplaint.reporterPhone,
      reportedAgainst: newComplaint.reportedAgainst,
      reportedDate: new Date().toISOString().split('T')[0],
      subject: newComplaint.subject,
      description: newComplaint.description,
      evidence: newComplaint.evidence || [],
      screenshots: newComplaint.screenshots || 0,
      assignedTo: 'Pending Assignment',
      notes: 0,
      relatedApplication: newComplaint.relatedApplication,
      relatedChild: newComplaint.relatedChild
    };
    setComplaints([complaint, ...complaints]);
    toast.success('Complaint filed successfully');
  };

  const handleComplaintUpdate = (updatedComplaint: Complaint) => {
    setComplaints(complaints.map(c =>
      c.id === updatedComplaint.id ? updatedComplaint : c
    ));
    setSelectedComplaint(updatedComplaint);
  };

  const handleComplaintDelete = (complaintId: string) => {
    setComplaints(complaints.filter(c => c.id !== complaintId));
    setShowDetails(false);
    setSelectedComplaint(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Fraud': return AlertTriangle;
      case 'Child Abuse': return Shield;
      case 'Fake Documents': return FileX;
      case 'Misconduct': return UserX;
      case 'Harassment': return AlertCircle;
      case 'Safety Concern': return Flag;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fraud': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Child Abuse': return 'bg-red-100 text-red-700 border-red-300';
      case 'Fake Documents': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Misconduct': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Harassment': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'Safety Concern': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Escalated': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="w-4 h-4" />;
      case 'Under Review': return <Eye className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      case 'Closed': return <XCircle className="w-4 h-4" />;
      case 'Escalated': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600 mt-1">Handle complaints and safety concerns</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.total}</h3>
          <p className="text-sm text-gray-600">Total Complaints</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.open}</h3>
          <p className="text-sm text-gray-600">Open Cases</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.critical}</h3>
          <p className="text-sm text-gray-600">Critical Priority</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Flag className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.escalated}</h3>
          <p className="text-sm text-gray-600">Escalated Cases</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaints..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {complaintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowFileModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            File New Complaint
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Complaint ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Against</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Evidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => {
                const TypeIcon = getTypeIcon(complaint.type);
                return (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(complaint.type)}`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{complaint.id}</p>
                          <p className="text-xs text-gray-500">{complaint.reportedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(complaint.type)}`}>
                        {complaint.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{complaint.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{complaint.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{complaint.reporter}</p>
                      <p className="text-xs text-gray-500">{complaint.reporterEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{complaint.reportedAgainst}</p>
                      {complaint.relatedApplication && (
                        <p className="text-xs text-blue-600">{complaint.relatedApplication}</p>
                      )}
                      {complaint.relatedChild && (
                        <p className="text-xs text-purple-600">{complaint.relatedChild}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">{complaint.evidence.length} files</p>
                        <p className="text-xs text-gray-600">{complaint.screenshots} screenshots</p>
                        <p className="text-xs text-gray-600">{complaint.notes} notes</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(complaint)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No complaints found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or file a new complaint</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFileModal && (
        <FileComplaintModal
          onClose={() => setShowFileModal(false)}
          onSubmit={handleFileComplaint}
        />
      )}

      {showDetails && selectedComplaint && (
        <ComplaintDetails
          complaint={selectedComplaint}
          onClose={() => {
            setShowDetails(false);
            setSelectedComplaint(null);
          }}
          onUpdate={handleComplaintUpdate}
          onDelete={handleComplaintDelete}
        />
      )}
    </div>
  );
}
