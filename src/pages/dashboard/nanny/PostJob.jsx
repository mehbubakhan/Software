import React, { useState } from 'react';
import { PlusCircle, Calendar, Users, FileText, CheckCircle2, MapPin, DollarSign, Clock, Baby, Briefcase } from 'lucide-react';
import api from '../../../services/api';

export default function PostJob() {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    availability_date: '',
    skills: '',
    type: '',
    location: '',
    experience: '',
    rate: '',
    children: '',
    ageGroup: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/nanny/jobs', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        title: '', availability_date: '', skills: '', type: '', location: '', experience: '', rate: '', children: '', ageGroup: '', description: ''
      });
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('Failed to post job. Please try again.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post a Job</h1>
        <p className="text-slate-500 font-medium mt-2">Create a job posting or request a substitute nanny.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handlePost} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Job Title</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Need a substitute for weekend care" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Availability Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="date" name="availability_date" value={formData.availability_date} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Required Skills</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. CPR, Newborn Care" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Job Type</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="type" value={formData.type} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 appearance-none">
                  <option value="" disabled>Select Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="substitute">Substitute / Fill-in</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Dhanmondi, Dhaka" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Previous Experience Required</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="experience" value={formData.experience} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 appearance-none">
                  <option value="" disabled>Select Experience Level</option>
                  <option value="none">No experience required</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Hourly Rate / Salary</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="e.g. ৳500/hr" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Number of Children</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="number" name="children" value={formData.children} onChange={handleChange} min="1" max="10" placeholder="1" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Age Group</label>
              <div className="relative">
                <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 appearance-none">
                  <option value="" disabled>Select Age</option>
                  <option value="newborn">Newborn (0-1 yr)</option>
                  <option value="toddler">Toddler (1-3 yrs)</option>
                  <option value="preschool">Preschool (3-5 yrs)</option>
                  <option value="school-age">School Age (5+ yrs)</option>
                  <option value="mixed">Mixed Ages</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Job Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the responsibilities, schedule, and any other important details..." required rows="5" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium resize-none"></textarea>
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 font-bold">
              <CheckCircle2 className="w-5 h-5" /> Job posted successfully! Your profile has been updated in the Parent's Nanny Hire directory.
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Publish Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
