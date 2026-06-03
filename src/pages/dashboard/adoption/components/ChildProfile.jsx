import { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Archive,
  Heart,
  Ban,
  Send,
  FileText,
  Upload,
  Image,
  Video,
  FileUp,
  Save,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import ChildTimeline from './ChildTimeline';
import { toast } from 'sonner';



export default function ChildProfile({ child, onClose, onUpdate, onRemove }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(child);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeReason, setRemoveReason] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(formData);
  };

  const handleAction = (action) => {
    switch (action) {
      case 'Archive':
        setRemoveReason('Archived');
        setShowRemoveConfirm(true);
        break;
      case 'Mark as Adopted':
        const updatedChild = { ...formData, adoptionStatus: 'Completed', availability: 'Adopted' };
        onUpdate(updatedChild);
        setFormData(updatedChild);
        toast.success(`${child.name} marked as adopted!`);
        break;
      case 'Disable Profile':
        setRemoveReason('Profile Disabled');
        setShowRemoveConfirm(true);
        break;
      case 'Transfer Child':
        toast.info('Transfer functionality - select destination facility');
        break;
      case 'Generate Report':
        toast.success('Generating comprehensive report...');
        setTimeout(() => {
          toast.success(`Report generated for ${child.name}`);
        }, 1500);
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  const confirmRemove = () => {
    onRemove(child.id, removeReason);
    setShowRemoveConfirm(false);
    onClose();
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'health', label: 'Health Information' },
    { id: 'education', label: 'Education Information' },
    { id: 'emotional', label: 'Emotional & Behavioral' },
    { id: 'media', label: 'Media & Documents' },
    { id: 'timeline', label: 'Timeline' }
  ];

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
            Back to Children List
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Child Header Info */}
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-5xl">
            {child.photo}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{child.name}</h1>
            <p className="text-lg text-gray-600 mt-1">Nickname: {child.nickname}</p>
            <div className="flex gap-4 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {child.id}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {child.availability}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {child.adoptionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAction('Archive')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Archive className="w-4 h-4" />
            Archive Child
          </button>
          <button
            onClick={() => handleAction('Mark as Adopted')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Mark
          </button>
          <button
            onClick={() => handleAction('Disable Profile')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Ban className="w-4 h-4" />
            Disable Profile
          </button>
          <button
            onClick={() => handleAction('Transfer Child')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Transfer Child
          </button>
          <button
            onClick={() => handleAction('Generate Report')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.nickname}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.age} years</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{formData.gender}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.bloodGroup}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleChange('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.religion}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.nationality}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.language}</p>
                )}
              </div>
            </div>
          )}

          {/* Health Information */}
          {activeTab === 'health' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Status</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.vaccinations}
                    onChange={(e) => handleChange('vaccinations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.vaccinations}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.medicalConditions}
                    onChange={(e) => handleChange('medicalConditions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.medicalConditions}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.allergies}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disabilities</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.disabilities}
                    onChange={(e) => handleChange('disabilities', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.disabilities}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Notes</label>
                {isEditing ? (
                  <textarea
                    value={formData.doctorNotes || ''}
                    onChange={(e) => handleChange('doctorNotes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter doctor's notes and observations..."
                  />
                ) : (
                  <p className="text-gray-900">{formData.doctorNotes || 'No notes available'}</p>
                )}
              </div>
            </div>
          )}

          {/* Education Information */}
          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleChange('school', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.school}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.educationLevel}
                    onChange={(e) => handleChange('educationLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.educationLevel}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Learning Skills</label>
                {isEditing ? (
                  <textarea
                    value={formData.learningSkills || ''}
                    onChange={(e) => handleChange('learningSkills', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe learning skills and abilities..."
                  />
                ) : (
                  <p className="text-gray-900">{formData.learningSkills || 'No information available'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.interests}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.hobbies || ''}
                    onChange={(e) => handleChange('hobbies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter hobbies..."
                  />
                ) : (
                  <p className="text-gray-900">{formData.hobbies || 'No hobbies listed'}</p>
                )}
              </div>
            </div>
          )}

          {/* Emotional & Behavioral */}
          {activeTab === 'emotional' && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.personalityType}
                    onChange={(e) => handleChange('personalityType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.personalityType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Behavior</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.socialBehavior}
                    onChange={(e) => handleChange('socialBehavior', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.socialBehavior}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emotional Condition</label>
                {isEditing ? (
                  <textarea
                    value={formData.emotionalCondition || ''}
                    onChange={(e) => handleChange('emotionalCondition', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe emotional state and condition..."
                  />
                ) : (
                  <p className="text-gray-900">{formData.emotionalCondition || 'No information available'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Care Instructions</label>
                {isEditing ? (
                  <textarea
                    value={formData.specialCareInstructions || ''}
                    onChange={(e) => handleChange('specialCareInstructions', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter special care instructions..."
                  />
                ) : (
                  <p className="text-gray-900">{formData.specialCareInstructions || 'No special instructions'}</p>
                )}
              </div>
            </div>
          )}

          {/* Media & Documents */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Image className="w-10 h-10 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">Upload Photo</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                  </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Video className="w-10 h-10 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">Upload Video</p>
                    <p className="text-xs text-gray-500 mt-1">MP4, AVI (Max 50MB)</p>
                  </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <FileUp className="w-10 h-10 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">Medical Report</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC (Max 10MB)</p>
                  </div>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Uploaded Files</h3>
                <div className="space-y-2">
                  {['Photo_2024_01.jpg', 'Medical_Report_Jan2024.pdf', 'Education_Report_2024.pdf'].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-900">{file}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <ChildTimeline childId={child.id} />
          )}
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Removal</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to remove <strong>{child.name}</strong> from the system?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Reason</option>
                <option value="Adopted">Adopted</option>
                <option value="Transferred">Transferred to Another Facility</option>
                <option value="Archived">Archived</option>
                <option value="Profile Disabled">Profile Disabled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                disabled={!removeReason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove Child
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
