import { useState } from 'react';
import {
  Heart,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import TrialBondingDetails from './TrialBondingDetails';
import { toast } from 'sonner';

interface BondingSession {
  id: string;
  childName: string;
  childId: string;
  parentNames: string;
  applicationId: string;
  startDate: string;
  endDate: string;
  currentWeek: number;
  status: string;
  overallScore: number;
  weeklyReports: any[];
  dailyNotes: any[];
  lastUpdateDate: string;
  socialWorker: string;
}

export default function TrialBonding() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<BondingSession | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    week: '',
    score: ''
  });

  const [bondingSessions, setBondingSessions] = useState<BondingSession[]>([
    {
      id: 'BOND-001',
      childName: 'Jacob Thomas',
      childId: 'CH006',
      parentNames: 'Thomas & Emily Anderson',
      applicationId: 'APP-2024-006',
      startDate: '2026-05-15',
      endDate: '2026-06-15',
      currentWeek: 3,
      status: 'In Progress',
      overallScore: 92,
      weeklyReports: [
        {
          week: 1,
          childComfort: 85,
          parentInteraction: 90,
          familyEnvironment: 88,
          emotionalBonding: 80,
          behaviourChanges: 82,
          notes: 'Excellent first week. Child showing positive signs of attachment.'
        },
        {
          week: 2,
          childComfort: 90,
          parentInteraction: 92,
          familyEnvironment: 90,
          emotionalBonding: 88,
          behaviourChanges: 87,
          notes: 'Continued improvement. Strong bond forming between child and parents.'
        },
        {
          week: 3,
          childComfort: 95,
          parentInteraction: 95,
          familyEnvironment: 92,
          emotionalBonding: 93,
          behaviourChanges: 90,
          notes: 'Outstanding progress. Child fully comfortable in new environment.'
        }
      ],
      dailyNotes: [
        { date: '2026-06-01', note: 'Child called parents "mom and dad" for first time', type: 'positive' },
        { date: '2026-06-02', note: 'Slight anxiety during bedtime routine', type: 'concern' },
        { date: '2026-06-03', note: 'Child voluntarily hugged parents', type: 'positive' }
      ],
      lastUpdateDate: '2026-06-03',
      socialWorker: 'Jennifer Lee'
    },
    {
      id: 'BOND-002',
      childName: 'Sarah Ann',
      childId: 'CH003',
      parentNames: 'Robert & Lisa Martinez',
      applicationId: 'APP-2024-003',
      startDate: '2026-05-20',
      endDate: '2026-06-20',
      currentWeek: 2,
      status: 'In Progress',
      overallScore: 88,
      weeklyReports: [
        {
          week: 1,
          childComfort: 80,
          parentInteraction: 85,
          familyEnvironment: 90,
          emotionalBonding: 75,
          behaviourChanges: 78,
          notes: 'Good start. Child adjusting well to new family.'
        },
        {
          week: 2,
          childComfort: 88,
          parentInteraction: 90,
          familyEnvironment: 92,
          emotionalBonding: 85,
          behaviourChanges: 85,
          notes: 'Significant improvement in emotional bonding this week.'
        }
      ],
      dailyNotes: [
        { date: '2026-05-28', note: 'Child shared toys with siblings', type: 'positive' },
        { date: '2026-05-30', note: 'Minor disagreement with sibling - resolved well', type: 'incident' }
      ],
      lastUpdateDate: '2026-05-30',
      socialWorker: 'Dr. Michael Chen'
    },
    {
      id: 'BOND-003',
      childName: 'Michael James',
      childId: 'CH002',
      parentNames: 'David & Sarah Williams',
      applicationId: 'APP-2024-002',
      startDate: '2026-05-01',
      endDate: '2026-06-01',
      currentWeek: 4,
      status: 'Completed - Approved',
      overallScore: 95,
      weeklyReports: [
        {
          week: 1,
          childComfort: 88,
          parentInteraction: 90,
          familyEnvironment: 92,
          emotionalBonding: 85,
          behaviourChanges: 87,
          notes: 'Excellent initial bonding.'
        },
        {
          week: 2,
          childComfort: 92,
          parentInteraction: 93,
          familyEnvironment: 94,
          emotionalBonding: 90,
          behaviourChanges: 91,
          notes: 'Strong progress in all areas.'
        },
        {
          week: 3,
          childComfort: 95,
          parentInteraction: 96,
          familyEnvironment: 95,
          emotionalBonding: 94,
          behaviourChanges: 93,
          notes: 'Outstanding bonding. Child fully integrated.'
        },
        {
          week: 4,
          childComfort: 98,
          parentInteraction: 97,
          familyEnvironment: 96,
          emotionalBonding: 96,
          behaviourChanges: 95,
          notes: 'Perfect bonding period. Ready for final adoption.'
        }
      ],
      dailyNotes: [],
      lastUpdateDate: '2026-06-01',
      socialWorker: 'Dr. Emily Brown'
    },
    {
      id: 'BOND-004',
      childName: 'Emma Johnson',
      childId: 'CH007',
      parentNames: 'Mark & Lisa Johnson',
      applicationId: 'APP-2024-007',
      startDate: '2026-05-25',
      endDate: '2026-06-25',
      currentWeek: 1,
      status: 'In Progress',
      overallScore: 75,
      weeklyReports: [
        {
          week: 1,
          childComfort: 70,
          parentInteraction: 75,
          familyEnvironment: 80,
          emotionalBonding: 65,
          behaviourChanges: 72,
          notes: 'Child showing some anxiety. Needs more time to adjust.'
        }
      ],
      dailyNotes: [
        { date: '2026-05-26', note: 'Child experienced separation anxiety', type: 'concern' },
        { date: '2026-05-27', note: 'Improved interaction during playtime', type: 'positive' }
      ],
      lastUpdateDate: '2026-05-27',
      socialWorker: 'Sarah Mitchell'
    }
  ]);

  const filteredSessions = bondingSessions.filter(session => {
    const matchesSearch =
      session.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.parentNames.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || session.status === filters.status;
    const matchesWeek = !filters.week ||
      (filters.week === '1' && session.currentWeek === 1) ||
      (filters.week === '2' && session.currentWeek === 2) ||
      (filters.week === '3' && session.currentWeek === 3) ||
      (filters.week === '4' && session.currentWeek === 4);

    const matchesScore = !filters.score ||
      (filters.score === 'excellent' && session.overallScore >= 90) ||
      (filters.score === 'good' && session.overallScore >= 70 && session.overallScore < 90) ||
      (filters.score === 'needs-improvement' && session.overallScore < 70);

    return matchesSearch && matchesStatus && matchesWeek && matchesScore;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      week: '',
      score: ''
    });
  };

  const handleUpdateSession = (updatedSession: BondingSession) => {
    setBondingSessions(bondingSessions.map(s =>
      s.id === updatedSession.id ? updatedSession : s
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Completed - Approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Completed - Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Extended':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Emergency Hold':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getTrendIcon = (session: BondingSession) => {
    if (session.weeklyReports.length < 2) return null;
    const lastWeek = session.weeklyReports[session.weeklyReports.length - 1];
    const previousWeek = session.weeklyReports[session.weeklyReports.length - 2];

    const lastAvg = (lastWeek.childComfort + lastWeek.parentInteraction + lastWeek.familyEnvironment + lastWeek.emotionalBonding + lastWeek.behaviourChanges) / 5;
    const prevAvg = (previousWeek.childComfort + previousWeek.parentInteraction + previousWeek.familyEnvironment + previousWeek.emotionalBonding + previousWeek.behaviourChanges) / 5;

    if (lastAvg > prevAvg) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (lastAvg < prevAvg) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  // Calculate statistics
  const stats = {
    inProgress: bondingSessions.filter(s => s.status === 'In Progress').length,
    completed: bondingSessions.filter(s => s.status.includes('Completed')).length,
    avgScore: Math.round(bondingSessions.reduce((sum, s) => sum + s.overallScore, 0) / bondingSessions.length),
    needsAttention: bondingSessions.filter(s => s.overallScore < 70 && s.status === 'In Progress').length
  };

  if (selectedSession) {
    return (
      <TrialBondingDetails
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onUpdate={handleUpdateSession}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trial Bonding Management</h1>
        <p className="text-gray-600 mt-1">Monitor and track 1-month trial bonding sessions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
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
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgScore}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Needs Attention</p>
              <p className="text-2xl font-bold text-gray-900">{stats.needsAttention}</p>
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
            Filter Sessions
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
            placeholder="Search by child name, bonding ID, or parent names..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed - Approved">Completed - Approved</option>
                <option value="Completed - Rejected">Completed - Rejected</option>
                <option value="Extended">Extended</option>
                <option value="Emergency Hold">Emergency Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Week</label>
              <select
                value={filters.week}
                onChange={(e) => handleFilterChange('week', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Weeks</option>
                <option value="1">Week 1</option>
                <option value="2">Week 2</option>
                <option value="3">Week 3</option>
                <option value="4">Week 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score Range</label>
              <select
                value={filters.score}
                onChange={(e) => handleFilterChange('score', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Scores</option>
                <option value="excellent">Excellent (90-100)</option>
                <option value="good">Good (70-89)</option>
                <option value="needs-improvement">Needs Improvement (&lt;70)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bonding Sessions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonding ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Week</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{session.childName}</div>
                    <div className="text-xs text-gray-500">{session.childId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm text-gray-900">{session.parentNames}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.startDate}</div>
                    <div className="text-xs text-gray-500">to {session.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Week {session.currentWeek}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${getScoreBg(session.overallScore)}`}
                          style={{ width: `${session.overallScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(session.overallScore)}`}>
                        {session.overallScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(session)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedSession(session)}
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

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bonding sessions found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredSessions.length}</span> of{' '}
            <span className="font-medium">{bondingSessions.length}</span> bonding sessions
          </div>
        </div>
      </div>
    </div>
  );
}
