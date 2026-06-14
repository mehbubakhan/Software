import { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';



export default function AddChildModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    age: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    nationality: '',
    language: '',
    vaccinations: '',
    medicalConditions: '',
    allergies: '',
    disabilities: '',
    school: '',
    educationLevel: '',
    interests: '',
    hobbies: '',
    personalityType: '',
    socialBehavior: '',
    photo: '',
    healthStatus: 'Good',
    availability: 'Available',
    adoptionStatus: 'Ready'
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (type: 'photo' | 'video') => {
    const fileName = type === 'photo' ? `Photo_${Date.now()}.jpg` : `Video_${Date.now()}.mp4`;
    if (type === 'photo') {
      setSelectedPhotos([...selectedPhotos, fileName]);
    } else {
      setSelectedVideos([...selectedVideos, fileName]);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    // Generate unique child ID (not used by backend, but kept for consistency)
    const childId = `CH${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const newChild = {
      id: childId,
      ...formData,
      age: parseInt(formData.age),
      photo: formData.gender === 'Male' ? '👦' : '👧',
      education: formData.educationLevel,
      createdDate: new Date().toISOString().split('T')[0],
      photos: selectedPhotos,
      videos: selectedVideos
    };

    try {
      await onSubmit(newChild);
      // Let the parent close the modal, or close if no error thrown
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Child</h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            {['Basic Info', 'Health Info', 'Education', 'Media'].map((label, index) => (
              <div
                key={index}
                className={`flex-1 text-center text-sm font-medium ${
                  step > index ? 'text-blue-600' : step === index + 1 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nickname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    max="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleChange('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language(s)</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    placeholder="e.g., English, Spanish"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                  <select
                    value={formData.healthStatus}
                    onChange={(e) => handleChange('healthStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Attention">Needs Attention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Status</label>
                  <select
                    value={formData.vaccinations}
                    onChange={(e) => handleChange('vaccinations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Up to date">Up to date</option>
                    <option value="Partially completed">Partially completed</option>
                    <option value="Not vaccinated">Not vaccinated</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => handleChange('medicalConditions', e.target.value)}
                    rows={3}
                    placeholder="List any medical conditions, or enter 'None'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="e.g., Peanuts, Pollen"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disabilities</label>
                  <input
                    type="text"
                    value={formData.disabilities}
                    onChange={(e) => handleChange('disabilities', e.target.value)}
                    placeholder="List any disabilities, or enter 'None'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education & Interests */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Education & Interests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleChange('school', e.target.value)}
                    placeholder="School name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => handleChange('educationLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="Preschool">Preschool</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                    placeholder="e.g., Drawing, Music, Sports"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                  <input
                    type="text"
                    value={formData.hobbies}
                    onChange={(e) => handleChange('hobbies', e.target.value)}
                    placeholder="e.g., Reading, Dancing, Gaming"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personality Type</label>
                  <input
                    type="text"
                    value={formData.personalityType}
                    onChange={(e) => handleChange('personalityType', e.target.value)}
                    placeholder="e.g., Cheerful, Outgoing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Social Behavior</label>
                  <input
                    type="text"
                    value={formData.socialBehavior}
                    onChange={(e) => handleChange('socialBehavior', e.target.value)}
                    placeholder="e.g., Good with peers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Media & Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
                  <button
                    type="button"
                    onClick={() => handleFileUpload('photo')}
                    className="w-full flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Click to upload photos</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                    </div>
                  </button>
                  {selectedPhotos.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedPhotos.map((photo, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {photo}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos</label>
                  <button
                    type="button"
                    onClick={() => handleFileUpload('video')}
                    className="w-full flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Click to upload videos</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, AVI (Max 50MB)</p>
                    </div>
                  </button>
                  {selectedVideos.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedVideos.map((video, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {video}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You can upload additional documents (medical reports, education reports)
                  after creating the child profile.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting ? 'Adding...' : 'Add Child'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
