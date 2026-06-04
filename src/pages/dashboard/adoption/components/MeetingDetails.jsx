import { useState } from 'react';
import {
  ArrowLeft,
  Video,
  Play,
  Square,
  Upload,
  Calendar,
  Edit,
  Ban,
  Save,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Link
} from 'lucide-react';
import { toast } from 'sonner';



export default function MeetingDetails({ meeting, onClose, onUpdate, onCancel }) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [formData, setFormData] = useState(meeting);

  // Counselling evaluation scores
  const [parentEvaluation, setParentEvaluation] = useState(meeting.parentEvaluation || {
    emotionalStability: 0,
    parentingReadiness: 0,
    stressHandling: 0,
    communicationSkills: 0
  });

  const [childObservation, setChildObservation] = useState(meeting.childObservation || {
    comfortLevel: 0,
    emotionalResponse: 0,
    attachmentSigns: 0,
    behaviourChanges: 0
  });

  const [counsellingNotes, setCounsellingNotes] = useState(meeting.counsellingNotes || '');

  const tabs = [
    { id: 'details', label: 'Meeting Details' },
    { id: 'parent-eval', label: 'Parent Evaluation' },
    { id: 'child-obs', label: 'Child Observation' },
    { id: 'scoring', label: 'Compatibility Scoring' }
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    const updatedMeeting = {
      ...formData,
      parentEvaluation,
      childObservation,
      counsellingNotes,
      compatibilityScore: calculateCompatibilityScore()
    };
    onUpdate(updatedMeeting);
    setIsEditing(false);
    toast.success('Meeting updated successfully');
  };

  const handleStartMeeting = () => {
    setIsMeetingActive(true);
    const updatedMeeting = { ...formData, status: 'In Progress' };
    setFormData(updatedMeeting);
    onUpdate(updatedMeeting);
    toast.success('Meeting started');
  };

  const handleEndMeeting = () => {
    setIsMeetingActive(false);
    const updatedMeeting = { ...formData, status: 'Completed' };
    setFormData(updatedMeeting);
    onUpdate(updatedMeeting);
    toast.success('Meeting ended');
  };

  const handleReschedule = () => {
    setIsEditing(true);
    toast.info('Update date and time to reschedule');
  };

  const handleCancelMeeting = () => {
    if (confirm('Are you sure you want to cancel this meeting?')) {
      onCancel(meeting.id);
      onClose();
    }
  };

  const calculateCompatibilityScore = () => {
    const parentAvg = Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4;
    const childAvg = Object.values(childObservation).reduce((a, b) => a + b, 0) / 4;
    return Math.round((parentAvg + childAvg) / 2);
  };

  const generateCounsellingReport = () => {
    toast.success('Generating counselling report...');
    setTimeout(() => {
      toast.success('Counselling report generated successfully!');
    }, 1500);
  };

  const getScoreLabel = (score) => {
    if (score >= 71) return { label: 'Strong Match', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 41) return { label: 'Moderate Match', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Poor Match', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getScoreColor = (score) => {
    if (score >= 71) return 'bg-green-500';
    if (score >= 41) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const compatibilityScore = calculateCompatibilityScore();
  const scoreInfo = getScoreLabel(compatibilityScore);

  const renderScoreSlider = (
    label,
    value,
    onChange,
    description
  ) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <span className={`text-2xl font-bold ${
          value >= 71 ? 'text-green-600' :
          value >= 41 ? 'text-yellow-600' : 'text-red-600'
        }`}>
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
            Back to Meetings List
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
              formData.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-300' :
              formData.status === 'In Progress' ? 'bg-purple-100 text-purple-700 border-purple-300' :
              formData.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
              'bg-blue-100 text-blue-700 border-blue-300'
            }`}>
              {formData.status}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{formData.title}</h1>
            <p className="text-lg text-gray-600 mt-1">Meeting ID: {formData.id}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-gray-600">
                <strong>Type:</strong> {formData.type}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Date:</strong> {formData.date} at {formData.time}
              </span>
              <span className="text-sm text-gray-600">
                <strong>Child:</strong> {formData.childName}
              </span>
            </div>
          </div>
          {formData.compatibilityScore !== undefined && (
            <div className="text-right">
              <div className={`text-4xl font-bold ${scoreInfo.color}`}>
                {compatibilityScore}%
              </div>
              <p className={`text-sm font-medium mt-1 px-3 py-1 rounded-full ${scoreInfo.bg} ${scoreInfo.color}`}>
                {scoreInfo.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {!isMeetingActive ? (
            <button
              onClick={handleStartMeeting}
              disabled={formData.status === 'Completed' || formData.status === 'Cancelled'}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Start Meeting
            </button>
          ) : (
            <button
              onClick={handleEndMeeting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Square className="w-4 h-4" />
              End Meeting
            </button>
          )}
          <button
            onClick={() => toast.info('Opening video session...')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Video className="w-4 h-4" />
            Join Video
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Notes
          </button>
          <button
            onClick={() => toast.info('Upload meeting report')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Report
          </button>
          <button
            onClick={handleReschedule}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Reschedule
          </button>
          <button
            onClick={handleCancelMeeting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Ban className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={generateCounsellingReport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate Report
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
          {/* Meeting Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                  <p className="text-gray-900">{formData.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.time}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                  <p className="text-gray-900">{formData.applicationId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                  <p className="text-gray-900">{formData.childName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Counsellor/Case Worker</label>
                  <p className="text-gray-900">{formData.counsellorName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-2">
                    {formData.participants.map((participant, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-900">
                        <Users className="w-4 h-4 text-gray-400" />
                        {participant}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {formData.videoLink && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Meeting Link</label>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                    <a
                      href={formData.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      {formData.videoLink}
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add meeting notes, agenda, or observations..."
                />
              </div>
            </div>
          )}

          {/* Parent Evaluation Tab */}
          {activeTab === 'parent-eval' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Parent Evaluation</h3>
                <p className="text-sm text-blue-800">
                  Assess the emotional and psychological readiness of prospective parents.
                  Rate each criterion from 0 (Poor) to 100 (Excellent).
                </p>
              </div>

              {renderScoreSlider(
                'Emotional Stability',
                parentEvaluation.emotionalStability,
                (value) => setParentEvaluation({ ...parentEvaluation, emotionalStability: value }),
                'Ability to maintain emotional balance and composure'
              )}

              {renderScoreSlider(
                'Parenting Readiness',
                parentEvaluation.parentingReadiness,
                (value) => setParentEvaluation({ ...parentEvaluation, parentingReadiness: value }),
                'Preparedness and understanding of parenting responsibilities'
              )}

              {renderScoreSlider(
                'Stress Handling',
                parentEvaluation.stressHandling,
                (value) => setParentEvaluation({ ...parentEvaluation, stressHandling: value }),
                'Capacity to manage stress and challenging situations'
              )}

              {renderScoreSlider(
                'Communication Skills',
                parentEvaluation.communicationSkills,
                (value) => setParentEvaluation({ ...parentEvaluation, communicationSkills: value }),
                'Ability to communicate effectively with child and others'
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Overall Parent Score</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getScoreColor(Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4)}`}
                      style={{ width: `${Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4}%` }}
                    ></div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Child Observation Tab */}
          {activeTab === 'child-obs' && (
            <div className="space-y-6">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-pink-900 mb-2">Child Observation</h3>
                <p className="text-sm text-pink-800">
                  Observe the child's emotional response and behavior during interactions with prospective parents.
                  Rate each criterion from 0 (Poor) to 100 (Excellent).
                </p>
              </div>

              {renderScoreSlider(
                'Comfort Level',
                childObservation.comfortLevel,
                (value) => setChildObservation({ ...childObservation, comfortLevel: value }),
                'How comfortable the child appears with the prospective parents'
              )}

              {renderScoreSlider(
                'Emotional Response',
                childObservation.emotionalResponse,
                (value) => setChildObservation({ ...childObservation, emotionalResponse: value }),
                'Positive emotional reactions and expressions'
              )}

              {renderScoreSlider(
                'Attachment Signs',
                childObservation.attachmentSigns,
                (value) => setChildObservation({ ...childObservation, attachmentSigns: value }),
                'Signs of bonding and attachment forming'
              )}

              {renderScoreSlider(
                'Behaviour Changes',
                childObservation.behaviourChanges,
                (value) => setChildObservation({ ...childObservation, behaviourChanges: value }),
                'Positive changes in behavior during interaction'
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Overall Child Response Score</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getScoreColor(Object.values(childObservation).reduce((a, b) => a + b, 0) / 4)}`}
                      style={{ width: `${Object.values(childObservation).reduce((a, b) => a + b, 0) / 4}%` }}
                    ></div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(Object.values(childObservation).reduce((a, b) => a + b, 0) / 4)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Compatibility Scoring Tab */}
          {activeTab === 'scoring' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Compatibility Score</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className={`text-7xl font-bold ${scoreInfo.color}`}>
                    {compatibilityScore}%
                  </div>
                </div>
                <div className="flex justify-center mb-6">
                  <span className={`px-6 py-3 text-lg font-bold rounded-full ${scoreInfo.bg} ${scoreInfo.color}`}>
                    {scoreInfo.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full ${getScoreColor(compatibilityScore)} transition-all duration-500`}
                    style={{ width: `${compatibilityScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-red-900 mb-2">0-40</h4>
                  <p className="text-sm text-red-700">Poor Match</p>
                  <p className="text-xs text-red-600 mt-2">Not recommended for adoption</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-yellow-900 mb-2">41-70</h4>
                  <p className="text-sm text-yellow-700">Moderate Match</p>
                  <p className="text-xs text-yellow-600 mt-2">May proceed with caution</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-green-900 mb-2">71-100</h4>
                  <p className="text-sm text-green-700">Strong Match</p>
                  <p className="text-xs text-green-600 mt-2">Highly recommended</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Score Breakdown</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Parent Evaluation Average</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreColor(Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4)}`}
                        style={{ width: `${Object.values(parentEvaluation).reduce((a, b) => a + b, 0) / 4}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Child Observation Average</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(Object.values(childObservation).reduce((a, b) => a + b, 0) / 4)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreColor(Object.values(childObservation).reduce((a, b) => a + b, 0) / 4)}`}
                        style={{ width: `${Object.values(childObservation).reduce((a, b) => a + b, 0) / 4}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Counselling Notes</label>
                <textarea
                  value={counsellingNotes}
                  onChange={(e) => setCounsellingNotes(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter detailed counselling observations, recommendations, and notes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {compatibilityScore >= 71 ? (
                  <button
                    onClick={() => toast.success('Bonding phase approved!')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Bonding
                  </button>
                ) : (
                  <button
                    onClick={() => toast.error('Match rejected due to low compatibility')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Match
                  </button>
                )}
                <button
                  onClick={() => toast.info('Additional session scheduled')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Request Additional Sessions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
