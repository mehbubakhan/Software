import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  AlertTriangle,
  Heart,
  Calendar,
  Save,
  FileText,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface TrialBondingDetailsProps {
  session: any;
  onClose: () => void;
  onUpdate: (session: any) => void;
}

export default function TrialBondingDetails({ session, onClose, onUpdate }: TrialBondingDetailsProps) {
  const [activeTab, setActiveTab] = useState('weekly-reports');
  const [weeklyReports, setWeeklyReports] = useState(session.weeklyReports);
  const [dailyNotes, setDailyNotes] = useState(session.dailyNotes);
  const [newDailyNote, setNewDailyNote] = useState({ date: '', note: '', type: 'positive' });
  const [currentWeekData, setCurrentWeekData] = useState({
    week: session.currentWeek,
    childComfort: 0,
    parentInteraction: 0,
    familyEnvironment: 0,
    emotionalBonding: 0,
    behaviourChanges: 0,
    notes: ''
  });

  const tabs = [
    { id: 'weekly-reports', label: 'Weekly Reports' },
    { id: 'daily-notes', label: 'Daily Observations' },
    { id: 'evaluation', label: 'Bonding Evaluation' }
  ];

  const calculateOverallScore = () => {
    if (weeklyReports.length === 0) return 0;
    const latestReport = weeklyReports[weeklyReports.length - 1];
    return Math.round((
      latestReport.childComfort +
      latestReport.parentInteraction +
      latestReport.familyEnvironment +
      latestReport.emotionalBonding +
      latestReport.behaviourChanges
    ) / 5);
  };

  const handleSaveWeeklyReport = () => {
    const updatedReports = [...weeklyReports, currentWeekData];
    setWeeklyReports(updatedReports);

    const updatedSession = {
      ...session,
      weeklyReports: updatedReports,
      overallScore: Math.round((
        currentWeekData.childComfort +
        currentWeekData.parentInteraction +
        currentWeekData.familyEnvironment +
        currentWeekData.emotionalBonding +
        currentWeekData.behaviourChanges
      ) / 5),
      lastUpdateDate: new Date().toISOString().split('T')[0]
    };

    onUpdate(updatedSession);
    toast.success(`Week ${currentWeekData.week} report saved successfully`);

    // Reset for next week
    setCurrentWeekData({
      week: currentWeekData.week + 1,
      childComfort: 0,
      parentInteraction: 0,
      familyEnvironment: 0,
      emotionalBonding: 0,
      behaviourChanges: 0,
      notes: ''
    });
  };

  const handleAddDailyNote = () => {
    if (!newDailyNote.date || !newDailyNote.note) {
      toast.error('Please fill in date and note');
      return;
    }

    const updatedNotes = [...dailyNotes, { ...newDailyNote }];
    setDailyNotes(updatedNotes);

    const updatedSession = {
      ...session,
      dailyNotes: updatedNotes,
      lastUpdateDate: new Date().toISOString().split('T')[0]
    };

    onUpdate(updatedSession);
    toast.success('Daily note added successfully');

    setNewDailyNote({ date: '', note: '', type: 'positive' });
  };

  const handleAction = (action: string) => {
    let updatedSession = { ...session };

    switch (action) {
      case 'continue':
        updatedSession.currentWeek += 1;
        toast.success('Bonding period continued');
        break;
      case 'extend':
        updatedSession.endDate = new Date(new Date(session.endDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        updatedSession.status = 'Extended';
        toast.success('Bonding period extended by 1 week');
        break;
      case 'approve':
        updatedSession.status = 'Completed - Approved';
        toast.success('Final adoption approved! Congratulations!');
        break;
      case 'reject':
        if (confirm('Are you sure you want to reject this adoption? This action cannot be undone.')) {
          updatedSession.status = 'Completed - Rejected';
          toast.error('Adoption rejected');
        } else {
          return;
        }
        break;
      case 'emergency':
        updatedSession.status = 'Emergency Hold';
        toast.error('Emergency alert raised - immediate attention required');
        break;
    }

    onUpdate(updatedSession);

    if (action === 'approve' || action === 'reject') {
      setTimeout(() => onClose(), 2000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'concern':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'incident':
        return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'recommendation':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  const renderScoreSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    description: string
  ) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(value)}`}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0 - Poor</span>
        <span>50 - Moderate</span>
        <span>100 - Excellent</span>
      </div>
    </div>
  );

  const overallScore = calculateOverallScore();

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
            Back to Bonding List
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
              session.status.includes('Approved') ? 'bg-green-100 text-green-700 border-green-300' :
              session.status.includes('Rejected') ? 'bg-red-100 text-red-700 border-red-300' :
              session.status === 'Extended' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
              session.status === 'Emergency Hold' ? 'bg-orange-100 text-orange-700 border-orange-300' :
              'bg-blue-100 text-blue-700 border-blue-300'
            }`}>
              {session.status}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{session.childName} & {session.parentNames}</h1>
            <p className="text-lg text-gray-600 mt-1">Bonding ID: {session.id}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-gray-600">
                <strong>Period:</strong> {session.startDate} to {session.endDate}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Current Week:</strong> {session.currentWeek} of 4
              </span>
              <span className="text-sm text-gray-600">
                <strong>Social Worker:</strong> {session.socialWorker}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Overall Score</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Bonding Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => handleAction('continue')}
            disabled={session.status !== 'In Progress'}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Continue Bonding</span>
          </button>
          <button
            onClick={() => handleAction('extend')}
            disabled={session.status !== 'In Progress'}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Extend Bonding</span>
          </button>
          <button
            onClick={() => handleAction('approve')}
            disabled={session.status !== 'In Progress' || overallScore < 70}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Approve Adoption</span>
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={session.status !== 'In Progress'}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Reject Adoption</span>
          </button>
          <button
            onClick={() => handleAction('emergency')}
            disabled={session.status !== 'In Progress'}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Emergency Alert</span>
          </button>
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
          {/* Weekly Reports Tab */}
          {activeTab === 'weekly-reports' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Weekly Observation Reports</h3>
                <p className="text-sm text-blue-800">
                  Track weekly progress across 5 key bonding indicators. Complete a report for each week of the trial period.
                </p>
              </div>

              {/* Previous Weeks */}
              {weeklyReports.map((report: any) => (
                <div key={report.week} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Week {report.week} Report</h4>
                    <span className={`text-2xl font-bold ${getScoreColor(
                      (report.childComfort + report.parentInteraction + report.familyEnvironment + report.emotionalBonding + report.behaviourChanges) / 5
                    )}`}>
                      {Math.round((report.childComfort + report.parentInteraction + report.familyEnvironment + report.emotionalBonding + report.behaviourChanges) / 5)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    {[
                      { label: 'Child Comfort', value: report.childComfort },
                      { label: 'Parent Interaction', value: report.parentInteraction },
                      { label: 'Family Environment', value: report.familyEnvironment },
                      { label: 'Emotional Bonding', value: report.emotionalBonding },
                      { label: 'Behaviour Changes', value: report.behaviourChanges }
                    ].map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                          {metric.value}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${getScoreBg(metric.value)}`}
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-900"><strong>Notes:</strong> {report.notes}</p>
                  </div>
                </div>
              ))}

              {/* Current Week Form */}
              {session.status === 'In Progress' && weeklyReports.length < 4 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Week {currentWeekData.week} Report (In Progress)</h4>

                  {renderScoreSlider(
                    'Child Comfort Level',
                    currentWeekData.childComfort,
                    (value) => setCurrentWeekData({ ...currentWeekData, childComfort: value }),
                    'How comfortable and at ease the child appears in the family environment'
                  )}

                  {renderScoreSlider(
                    'Parent Interaction Quality',
                    currentWeekData.parentInteraction,
                    (value) => setCurrentWeekData({ ...currentWeekData, parentInteraction: value }),
                    'Quality and frequency of positive interactions between parents and child'
                  )}

                  {renderScoreSlider(
                    'Family Environment',
                    currentWeekData.familyEnvironment,
                    (value) => setCurrentWeekData({ ...currentWeekData, familyEnvironment: value }),
                    'Overall family atmosphere, warmth, and acceptance'
                  )}

                  {renderScoreSlider(
                    'Emotional Bonding',
                    currentWeekData.emotionalBonding,
                    (value) => setCurrentWeekData({ ...currentWeekData, emotionalBonding: value }),
                    'Signs of attachment and emotional connection forming'
                  )}

                  {renderScoreSlider(
                    'Behaviour Changes',
                    currentWeekData.behaviourChanges,
                    (value) => setCurrentWeekData({ ...currentWeekData, behaviourChanges: value }),
                    'Positive behavioral improvements and adaptations'
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Summary Notes</label>
                    <textarea
                      value={currentWeekData.notes}
                      onChange={(e) => setCurrentWeekData({ ...currentWeekData, notes: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Summarize key observations, progress, and any concerns from this week..."
                    />
                  </div>

                  <button
                    onClick={handleSaveWeeklyReport}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Save Week {currentWeekData.week} Report
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Daily Notes Tab */}
          {activeTab === 'daily-notes' && (
            <div className="space-y-6">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-pink-900 mb-2">Daily Observation Notes</h3>
                <p className="text-sm text-pink-800">
                  Record daily observations, incidents, positive changes, and concerns during the bonding period.
                </p>
              </div>

              {/* Add New Note Form */}
              {session.status === 'In Progress' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Add Daily Observation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newDailyNote.date}
                        onChange={(e) => setNewDailyNote({ ...newDailyNote, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
                      <select
                        value={newDailyNote.type}
                        onChange={(e) => setNewDailyNote({ ...newDailyNote, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="positive">Positive Changes</option>
                        <option value="concern">Concerns</option>
                        <option value="incident">Incidents</option>
                        <option value="recommendation">Recommendations</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observation Note</label>
                    <textarea
                      value={newDailyNote.note}
                      onChange={(e) => setNewDailyNote({ ...newDailyNote, note: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter detailed observation..."
                    />
                  </div>
                  <button
                    onClick={handleAddDailyNote}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>
              )}

              {/* Daily Notes List */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-900">All Observations ({dailyNotes.length})</h4>
                {dailyNotes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No daily notes recorded yet.</p>
                ) : (
                  dailyNotes.slice().reverse().map((note: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${getNoteTypeColor(note.type)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{note.date}</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-white rounded-full uppercase">
                          {note.type}
                        </span>
                      </div>
                      <p className="text-sm">{note.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Bonding Evaluation Tab */}
          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Overall Bonding Evaluation</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className={`text-7xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full ${getScoreBg(overallScore)} transition-all duration-500`}
                    style={{ width: `${overallScore}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className={`p-4 rounded-lg text-center ${overallScore >= 90 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                    <p className="font-bold text-green-900">90-100</p>
                    <p className="text-xs text-green-700">Excellent Match</p>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${overallScore >= 70 && overallScore < 90 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                    <p className="font-bold text-blue-900">70-89</p>
                    <p className="text-xs text-blue-700">Good Match</p>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${overallScore < 70 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'}`}>
                    <p className="font-bold text-yellow-900">&lt;70</p>
                    <p className="text-xs text-yellow-700">Needs Improvement</p>
                  </div>
                </div>
              </div>

              {/* Weekly Progress Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Weekly Progress Tracking</h4>
                <div className="space-y-4">
                  {weeklyReports.map((report: any) => {
                    const weekAvg = Math.round((report.childComfort + report.parentInteraction + report.familyEnvironment + report.emotionalBonding + report.behaviourChanges) / 5);
                    return (
                      <div key={report.week}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Week {report.week}</span>
                          <span className={`text-sm font-bold ${getScoreColor(weekAvg)}`}>{weekAvg}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getScoreBg(weekAvg)}`}
                            style={{ width: `${weekAvg}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendation */}
              <div className={`border-2 rounded-lg p-6 ${
                overallScore >= 90 ? 'bg-green-50 border-green-300' :
                overallScore >= 70 ? 'bg-blue-50 border-blue-300' :
                'bg-yellow-50 border-yellow-300'
              }`}>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {overallScore >= 90 ? '✅ Recommendation: Approve Final Adoption' :
                   overallScore >= 70 ? '⚠️ Recommendation: Continue Monitoring' :
                   '❌ Recommendation: Additional Support Needed'}
                </h4>
                <p className="text-sm text-gray-700">
                  {overallScore >= 90
                    ? 'The bonding period has been highly successful. Child and parents have formed a strong attachment. Recommend proceeding with final adoption approval.'
                    : overallScore >= 70
                    ? 'Bonding is progressing well but could benefit from additional time. Consider extending the bonding period or providing additional support.'
                    : 'Bonding period showing challenges. Recommend additional counselling sessions and support before proceeding.'}
                </p>
              </div>

              {/* Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Session Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{weeklyReports.length}</p>
                    <p className="text-sm text-gray-600">Weeks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{dailyNotes.length}</p>
                    <p className="text-sm text-gray-600">Daily Notes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {dailyNotes.filter((n: any) => n.type === 'positive').length}
                    </p>
                    <p className="text-sm text-gray-600">Positive Observations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">
                      {dailyNotes.filter((n: any) => n.type === 'concern').length}
                    </p>
                    <p className="text-sm text-gray-600">Concerns Noted</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
