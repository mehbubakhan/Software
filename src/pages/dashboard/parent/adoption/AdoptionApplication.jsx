import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function AdoptionApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', maritalStatus: '',
    occupation: '', employer: '', income: '', housingType: '', householdMembers: '', pets: '',
    motivation: '', experience: '', references: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const response = await api.get(`/adoption/children/${id}`);
        setChild(response.data.data);
      } catch (err) {
        console.error('Error fetching child:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/adoption/apply', {
        child_id: child.id,
        orphanage_id: child.orphanage_id,
        submitted_documents: [
          { name: 'Identity Document (ID/Passport)', uploaded: false },
          { name: 'Proof of Income / Financial Statement', uploaded: false },
          { name: 'Background Check Certificate', uploaded: false }
        ],
        form_data: formData
      });
      navigate('/dashboard/parent/adoption/applications');
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center text-slate-500 py-12">Loading application...</div>;
  if (!child) return <div className="text-center text-slate-500 py-12">Child not found.</div>;

  const childName = child.child_name || child.name || 'Child Profile';
  const childLocation = child.orphanage_name || child.currentLocation || 'Adoption center';

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Adoption Application</h1>
          <p className="text-slate-500">Applying for: <span className="font-bold text-slate-800">{childName}</span> ({child.age}, {child.gender})</p>
          <p className="text-slate-500 text-sm mt-1">{childLocation}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-fuchsia-400' : 'text-slate-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-fuchsia-600 text-white' : 'bg-slate-100'}`}>1</div>
            <div className="text-sm font-semibold">Personal Info</div>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-fuchsia-600' : 'bg-slate-100'}`}></div>
          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-fuchsia-400' : 'text-slate-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-fuchsia-600 text-white' : 'bg-slate-100'}`}>2</div>
            <div className="text-sm font-semibold">Household Details</div>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-fuchsia-600' : 'bg-slate-100'}`}></div>
          <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-fuchsia-400' : 'text-slate-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-fuchsia-600 text-white' : 'bg-slate-100'}`}>3</div>
            <div className="text-sm font-semibold">Motivation</div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Street Address *</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Zip Code *</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Marital Status *</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500 appearance-none">
                      <option value=""></option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Household Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Household & Financial Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Occupation *</label>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Employer *</label>
                    <input type="text" name="employer" value={formData.employer} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Annual Household Income *</label>
                    <input type="text" name="income" value={formData.income} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Housing Type *</label>
                    <select name="housingType" value={formData.housingType} onChange={handleChange} required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500 appearance-none">
                      <option value=""></option>
                      <option value="own">Own Home</option>
                      <option value="rent">Rent Apartment/House</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Household Members *</label>
                    <input type="text" name="householdMembers" value={formData.householdMembers} onChange={handleChange} placeholder="Number of adults and children" required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Do you have pets? *</label>
                    <input type="text" name="pets" value={formData.pets} onChange={handleChange} placeholder="If yes, please specify" required className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Motivation */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Motivation & Experience</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Why do you want to adopt {childName}? (Minimum 100 characters) *</label>
                  <textarea rows={4} name="motivation" value={formData.motivation} onChange={handleChange} required minLength={100} placeholder="Please share your motivation for adoption and what you can offer to the child..." className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500"></textarea>
                  <div className="text-right text-xs text-slate-500 mt-1">{formData.motivation.length} / 100 characters</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Previous experience with children (Optional)</label>
                  <textarea rows={3} name="experience" value={formData.experience} onChange={handleChange} placeholder="Share any relevant experience with childcare, parenting, or working with children..." className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Character References *</label>
                  <textarea rows={3} name="references" value={formData.references} onChange={handleChange} required placeholder="Please provide names and contact information for 2-3 character references..." className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:border-fuchsia-500"></textarea>
                </div>

                <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500 flex gap-3 items-start">
                  <span className="text-fuchsia-400">🔒</span>
                  <p>After submitting this application, you'll need to upload required documents including ID, proof of income, background check, and other supporting materials.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold py-3 px-8 rounded-xl transition"
                >
                  Previous
                </button>
              ) : <div></div>}
              
              <button 
                type="submit"
                disabled={submitting}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-8 rounded-xl transition disabled:opacity-50"
              >
                {step < 3 ? 'Next Step' : submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}


