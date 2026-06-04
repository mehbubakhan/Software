import { useState } from 'react';
import {
  Calendar,
  Video,
  Plus,
  Download,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Clock,
  Users,
  MessageCircle,
  Heart,
  FileText,
  CheckCircle
} from 'lucide-react';
import MeetingDetails from './MeetingDetails';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  status: string;
  participants: string[];
  applicationId: string;
  childName: string;
  videoLink?: string;
  notes?: string;
  counsellorName?: string;
  compatibilityScore?: number;
  parentEvaluation?: {
    emotionalStability: number;
    parentingReadiness: number;
    stressHandling: number;
    communicationSkills: number;
  };
  childObservation?: {
    comfortLevel: number;
    emotionalResponse: number;
    attachmentSigns: number;
    behaviourChanges: number;
  };
  counsellingNotes?: string;
}

export default function MeetingsCounselling() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    date: ''
  });

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'MTG-001',
      title: 'Initial Interview - Smith Family',
      type: 'Initial Interview',
      date: '2026-06-05',
      time: '10:00 AM',
      status: 'Scheduled',
      participants: ['John Smith', 'Mary Smith', 'Case Worker: Sarah Johnson'],
      applicationId: 'APP-2024-001',
      childName: 'Emily Rose',
      videoLink: 'https://meet.example.com/smith-interview',
      notes: 'First meeting to assess family dynamics and parenting expectations.',
      counsellorName: 'Dr. Sarah Johnson'
    },
    {
      id: 'MTG-002',
      title: 'Counselling Session - Williams Family',
      type: 'Counselling Session',
      date: '2026-06-04',
      time: '2:00 PM',
      status: 'Completed',
      participants: ['David Williams', 'Sarah Williams', 'Child: Michael James', 'Counsellor: Dr. Emily Brown'],
      applicationId: 'APP-2024-002',
      childName: 'Michael James',
      counsellorName: 'Dr. Emily Brown',
      compatibilityScore: 88,
      parentEvaluation: {
        emotionalStability: 90,
        parentingReadiness: 85,
        stressHandling: 88,
        communicationSkills: 90
      },
      childObservation: {
        comfortLevel: 85,
        emotionalResponse: 90,
        attachmentSigns: 82,
        behaviourChanges: 88
      },
      counsellingNotes: 'Excellent session. Parents showed strong emotional intelligence and the child responded very positively. Strong attachment forming. Recommend proceeding to trial bonding.'
    },
    {
      id: 'MTG-003',
      title: 'Trial Bonding Session - Martinez Family',
      type: 'Trial Bonding Session',
      date: '2026-06-06',
      time: '3:00 PM',
      status: 'Scheduled',
      participants: ['Robert Martinez', 'Lisa Martinez', 'Child: Sarah Ann', 'Observer: Dr. Michael Chen'],
      applicationId: 'APP-2024-003',
      childName: 'Sarah Ann',
      videoLink: 'https://meet.example.com/martinez-bonding',
      counsellorName: 'Dr. Michael Chen',
      notes: 'First bonding session. Will observe interaction patterns and emotional connection.'
    },
    {
      id: 'MTG-004',
      title: 'Final Review - Anderson Family',
      type: 'Final Review',
      date: '2026-06-07',
      time: '11:00 AM',
      status: 'Scheduled',
      participants: ['Thomas Anderson', 'Emily Anderson', 'Social Worker: Jennifer Lee'],
      applicationId: 'APP-2024-006',
      childName: 'Jacob Thomas',
      counsellorName: 'Jennifer Lee',
      compatibilityScore: 97,
      notes: 'Final assessment before adoption approval.'
    },
    {
      id: 'MTG-005',
      title: 'Post-Adoption Follow-up - Brown Family',
      type: 'Post-Adoption Follow-up',
      date: '2026-06-10',
      time: '1:00 PM',
      status: 'Scheduled',
      participants: ['James Brown', 'Patricia Brown', 'Child: David Lee', 'Social Worker: Mark Wilson'],
      applicationId: 'APP-2024-004',
      childName: 'David Lee',
      counsellorName: 'Mark Wilson',
      notes: '3-month post-adoption check-in.'
    },
    {
      id: 'MTG-006',
      title: 'Counselling Session - Davis Family',
      type: 'Counselling Session',
      date: '2026-06-03',
      time: '4:00 PM',
      status: 'Cancelled',
      participants: ['Michael Davis', 'Jennifer Davis', 'Counsellor: Dr. Lisa White'],
      applicationId: 'APP-2024-005',
      childName: 'Olivia Grace',
      counsellorName: 'Dr. Lisa White',
      compatibilityScore: 45,
      parentEvaluation: {
        emotionalStability: 50,
        parentingReadiness: 40,
        stressHandling: 45,
        communicationSkills: 50
      },
      childObservation: {
        comfortLevel: 40,
        emotionalResponse: 45,
        attachmentSigns: 35,
        behaviourChanges: 50
      },
      counsellingNotes: 'Session revealed concerns about parenting readiness. Child showed discomfort. Recommended additional preparation before proceeding.'
    }
  ]);

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.childName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !filters.type || meeting.type === filters.type;
    const matchesStatus = !filters.status || meeting.status === filters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      date: ''
    });
  };

  const handleAddMeeting = (meetingData: any) => {
    const newMeeting: Meeting = {
      id: `MTG-${String(meetings.length + 1).padStart(3, '0')}`,
      ...meetingData,
      status: 'Scheduled'
    };
    setMeetings([newMeeting, ...meetings]);
    toast.success('Meeting scheduled successfully!');
  };

  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(meetings.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
  };

  const handleCancelMeeting = (meetingId: string) => {
    setMeetings(meetings.map(m =>
      m.id === meetingId ? { ...m, status: 'Cancelled' } : m
    ));
    toast.success('Meeting cancelled');
  };

  const handleExportLogs = () => {
    toast.success('Exporting meeting logs...');
    setTimeout(() => {
      toast.success('Meeting logs exported successfully!');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Rescheduled':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Initial Interview':
        return 'bg-blue-100 text-blue-700';
      case 'Counselling Session':
        return 'bg-purple-100 text-purple-700';
      case 'Trial Bonding Session':
        return 'bg-pink-100 text-pink-700';
      case 'Final Review':
        return 'bg-green-100 text-green-700';
      case 'Post-Adoption Follow-up':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Initial Interview':
        return <Users className="w-4 h-4" />;
      case 'Counselling Session':
        return <MessageCircle className="w-4 h-4" />;
      case 'Trial Bonding Session':
        return <Heart className="w-4 h-4" />;
      case 'Final Review':
        return <CheckCircle className="w-4 h-4" />;
      case 'Post-Adoption Follow-up':
        return <FileText className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const stats = {
    scheduled: meetings.filter(m => m.status === 'Scheduled').length,
    completed: meetings.filter(m => m.status === 'Completed').length,
    inProgress: meetings.filter(m => m.status === 'In Progress').length,
    cancelled: meetings.filter(m => m.status === 'Cancelled').length
  };

  if (selectedMeeting) {
    return (
      <MeetingDetails
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        onUpdate={handleUpdateMeeting}
        onCancel={handleCancelMeeting}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meetings & Counselling</h1>
        <p className="text-gray-600 mt-1">Manage all interviews, counselling sessions, and bonding meetings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </button>
          <button
            onClick={() => toast.info('Creating video session...')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Video className="w-4 h-4" />
            Create Video Session
          </button>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Meeting Logs
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter Meetings
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by meeting title, ID, or child name..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Initial Interview">Initial Interview</option>
                <option value="Counselling Session">Counselling Session</option>
                <option value="Trial Bonding Session">Trial Bonding Session</option>
                <option value="Final Review">Final Review</option>
                <option value="Post-Adoption Follow-up">Post-Adoption Follow-up</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Meetings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMeetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{meeting.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{meeting.title}</div>
                    <div className="text-xs text-gray-500">{meeting.counsellorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getTypeColor(meeting.type)}`}>
                      {getTypeIcon(meeting.type)}
                      {meeting.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{meeting.date}</div>
                    <div className="text-xs text-gray-500">{meeting.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meeting.childName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {meeting.compatibilityScore ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                          <div
                            className={`h-2 rounded-full ${
                              meeting.compatibilityScore >= 71 ? 'bg-green-500' :
                              meeting.compatibilityScore >= 41 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${meeting.compatibilityScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${
                          meeting.compatibilityScore >= 71 ? 'text-green-600' :
                          meeting.compatibilityScore >= 41 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {meeting.compatibilityScore}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
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

        {filteredMeetings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No meetings found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredMeetings.length}</span> of{' '}
            <span className="font-medium">{meetings.length}</span> meetings
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

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <ScheduleMeetingModal
          onClose={() => setShowScheduleModal(false)}
          onSubmit={handleAddMeeting}
        />
      )}
    </div>
  );
}
