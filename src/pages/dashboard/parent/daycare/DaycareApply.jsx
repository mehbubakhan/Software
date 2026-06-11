import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';

export default function DaycareApply() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    address: '',
    childName: '',
    childAge: '',
    dob: '',
    gender: '',
    careType: 'Full-Time',
    startDate: '',
    allergies: '',
    medications: '',
    conditions: '',
    emergencyName: '',
    emergencyPhone: '',
    relation: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/daycare/${id}/apply`, formData);
      // On success, redirect to payment
      navigate(`/dashboard/parent/daycare/${id}/payment`);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 font-sans">
      <div className="max-w-3xl mx-auto mt-6">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 mb-6 transition text-sm font-semibold w-max">
          ← Back to Details
        </button>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Apply to Little Stars Daycare</h1>
          <p className="text-slate-600 text-sm">Complete this form to apply for admission. We'll review your application and contact you within 24-48 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Parent Information */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Parent/Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" placeholder="John Doe" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john.doe@example.com" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="(555) 123-4567" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Home Address <span className="text-red-500">*</span></label>
                <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="123 Main Street, City, State" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Child Information */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Child Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Child's Full Name <span className="text-red-500">*</span></label>
                <input required name="childName" value={formData.childName} onChange={handleChange} type="text" placeholder="Emma Doe" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Age <span className="text-red-500">*</span></label>
                <input required name="childAge" value={formData.childAge} onChange={handleChange} type="number" placeholder="3" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                <input required name="dob" value={formData.dob} onChange={handleChange} type="date" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Care Details */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Care Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Type of Care <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Full-Time', 'Part-Time', 'Hourly'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, careType: type }))}
                    className={`border rounded-xl p-4 text-left transition ${formData.careType === type ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700' : 'border-slate-300 hover:border-slate-400 bg-white'}`}
                  >
                    <div className="font-bold">{type}</div>
                    <div className={`text-xs mt-1 ${formData.careType === type ? 'text-fuchsia-600' : 'text-slate-500'}`}>{type === 'Full-Time' ? 'Monday - Friday, Full Day' : type === 'Part-Time' ? '3 days per week' : 'Flexible hourly care'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Start Date <span className="text-red-500">*</span></label>
              <input required name="startDate" value={formData.startDate} onChange={handleChange} type="date" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Medical Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Known Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="2" placeholder="List any allergies (food, environmental, etc.)" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Medications</label>
                <textarea name="medications" value={formData.medications} onChange={handleChange} rows="2" placeholder="List any medications your child is currently taking" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Medical Conditions</label>
                <textarea name="conditions" value={formData.conditions} onChange={handleChange} rows="2" placeholder="List any medical conditions we should be aware of" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm"></textarea>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Name <span className="text-red-500">*</span></label>
                <input required name="emergencyName" value={formData.emergencyName} onChange={handleChange} type="text" placeholder="Jane Doe" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Phone <span className="text-red-500">*</span></label>
                <input required name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} type="tel" placeholder="(555) 987-6543" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Relation to Child <span className="text-red-500">*</span></label>
                <input required name="relation" value={formData.relation} onChange={handleChange} type="text" placeholder="Grandmother, Aunt, etc." className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Additional Information</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Additional Notes (Optional)</label>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="3" placeholder="Any additional information you'd like to share about your child's needs, preferences, or special requirements" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-sm"></textarea>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 shadow-sm transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-[2] bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3.5 rounded-xl shadow-sm transition disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            By submitting this form, you agree to our Terms and Conditions and Privacy Policy.
          </p>

        </form>
      </div>
    </div>
  );
}

