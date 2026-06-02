import React, { useState, useEffect } from 'react'
import api from '../../../services/api'

export default function JobRequests() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    child_age: '',
    salary_offered: '',
    schedule: '',
    location: '',
    special_requirements: ''
  })

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/parent/my')
      if (res.data.ok) {
        setJobs(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/jobs/parent/post', formData)
      if (res.data.ok) {
        setShowForm(false)
        setFormData({ title: '', child_age: '', salary_offered: '', schedule: '', location: '', special_requirements: '' })
        fetchJobs()
      } else {
        alert('Failed to post job')
      }
    } catch (err) {
      alert('Error posting job')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Job Requests</h1>
          <p className="mt-2 text-slate-300">View and manage your nanny job postings.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold text-white hover:bg-fuchsia-700"
        >
          {showForm ? 'Cancel' : 'Post New Job'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-2xl text-slate-900">
          <h2 className="text-xl font-bold">Create a Job Post</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="block col-span-2">
              <span className="text-sm font-semibold text-slate-700">Job Title</span>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. Part-time Nanny for 4yo" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Child Age(s)</span>
              <input required value={formData.child_age} onChange={e => setFormData({...formData, child_age: e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. 4 and 6" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Salary Offered ($/hr)</span>
              <input type="number" required value={formData.salary_offered} onChange={e => setFormData({...formData, salary_offered: e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. 20" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Schedule</span>
              <input required value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. Mon-Fri 9AM-5PM" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Location</span>
              <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="e.g. Downtown" />
            </label>
            <label className="block col-span-2">
              <span className="text-sm font-semibold text-slate-700">Special Requirements</span>
              <textarea value={formData.special_requirements} onChange={e => setFormData({...formData, special_requirements: e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-24" placeholder="e.g. Must have car, CPR certified" />
            </label>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold text-white hover:bg-fuchsia-700 w-full">
            Submit Job Post
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-slate-200/20 bg-white/5 p-8 text-center text-slate-400">
          No job requests found. Create one to start hiring nannies.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job.id} className="rounded-lg border border-slate-200/20 bg-[#151821] p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{job.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4">{new Date(job.created_at).toLocaleDateString()}</p>
              
              <div className="space-y-2 text-sm text-slate-300">
                <p><span className="font-semibold text-slate-500">Children:</span> Age {job.child_age}</p>
                <p><span className="font-semibold text-slate-500">Pay:</span> ${job.salary_offered}/hr</p>
                <p><span className="font-semibold text-slate-500">Schedule:</span> {job.schedule}</p>
                <p><span className="font-semibold text-slate-500">Location:</span> {job.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
