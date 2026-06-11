import React, { useState, useEffect } from 'react'
import api from '../../../services/api'

export default function JobRequests() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('direct') // 'postings' or 'direct'
  const [selectedRequest, setSelectedRequest] = useState(null)
  
  // Payment Modal States
  const [paymentData, setPaymentData] = useState(null) // Holds the request being paid for
  const [paymentStep, setPaymentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  
  const [editingJobId, setEditingJobId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    child_age: '',
    salary_offered: '',
    schedule: '',
    location: '',
    special_requirements: ''
  })

  // Mock data for direct booking requests sent to specific nannies
  const [directRequests, setDirectRequests] = useState([
    {
      id: 1,
      nannyName: 'Kamrun Nahar',
      date: 'Oct 25, 2023',
      time: '9 AM - 5 PM',
      status: 'Pending',
      description: 'Need full day care for my 4 year old.',
      createdAt: 'Just now',
      amount: '$160.00'
    },
    {
      id: 2,
      nannyName: 'Maria Mim',
      date: 'Nov 02, 2023',
      time: '10 AM - 2 PM',
      status: 'Approved',
      description: 'Need someone to watch the kids while I run errands.',
      createdAt: '2 days ago',
      amount: '$80.00'
    },
    {
      id: 3,
      nannyName: 'Sadia Afrin',
      date: 'Nov 15, 2023',
      time: '6 PM - 10 PM',
      status: 'Declined',
      description: 'Date night babysitting needed.',
      createdAt: '1 week ago',
      amount: '$90.00'
    }
  ])

  const handleCancelRequest = (id) => {
    if (window.confirm('Are you sure you want to cancel this job request?')) {
      setDirectRequests(directRequests.map(req => req.id === id ? { ...req, status: 'Cancelled' } : req));
    }
  }

  const handleDeleteDirectRequest = (id) => {
    if (window.confirm('Are you sure you want to delete this booking history?')) {
      setDirectRequests(directRequests.filter(req => req.id !== id));
    }
  }

  const handleMakePayment = (req) => {
    setPaymentData(req)
    setPaymentStep(1)
    setPaymentMethod('')
    setCustomAmount(req.amount.replace(/[^0-9.]/g, '')) // Initialize with the default number
  }

  const processPayment = () => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsProcessingPayment(false)
      setTransactionId('TXN' + Math.random().toString().slice(2, 10))
      setPaymentStep(3) // Success step
      setDirectRequests(directRequests.map(r => r.id === paymentData.id ? { ...r, status: 'Booked', paidAmount: customAmount } : r))
    }, 2000)
  }

  const downloadReceipt = () => {
    const receiptText = `
========================================
           PAYMENT RECEIPT              
     Nanny Booking Services             
========================================
Transaction ID : ${transactionId}
Date           : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Paid To        : ${paymentData?.nannyName}
Payment Method : ${paymentMethod}
========================================
TOTAL PAID     : $${Number(customAmount || 0).toFixed(2)}
========================================
    `;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
      let res;
      if (editingJobId) {
        res = await api.put(`/jobs/parent/post/${editingJobId}`, formData)
      } else {
        res = await api.post('/jobs/parent/post', formData)
      }
      
      if (res.data.ok) {
        setShowForm(false)
        setEditingJobId(null)
        setFormData({ title: '', child_age: '', salary_offered: '', schedule: '', location: '', special_requirements: '' })
        fetchJobs()
      } else {
        alert(editingJobId ? 'Failed to update job' : 'Failed to post job')
      }
    } catch (err) {
      alert('Error saving job')
    }
  }

  const handleEditPost = (job) => {
    setEditingJobId(job.id)
    setFormData({
      title: job.title,
      child_age: job.child_age,
      salary_offered: job.salary_offered,
      schedule: job.schedule,
      location: job.location,
      special_requirements: job.special_requirements || ''
    })
    setShowForm(true)
    setActiveTab('postings')
  }

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      try {
        const res = await api.delete(`/jobs/parent/post/${id}`)
        if (res.data.ok) {
          fetchJobs()
        } else {
          alert('Failed to delete job')
        }
      } catch (err) {
        alert('Error deleting job')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Job Requests & Bookings</h1>
          <p className="mt-2 text-slate-500">Track your direct nanny bookings and public job postings.</p>
        </div>
        {activeTab === 'postings' && (
          <button 
            onClick={() => {
              if (showForm) {
                setShowForm(false)
                setEditingJobId(null)
                setFormData({ title: '', child_age: '', salary_offered: '', schedule: '', location: '', special_requirements: '' })
              } else {
                setShowForm(true)
              }
            }}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition"
          >
            {showForm ? 'Cancel' : '➕ Post New Job'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <button 
          onClick={() => setActiveTab('direct')}
          className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === 'direct' ? 'bg-fuchsia-600 text-white' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'}`}
        >
          Direct Bookings
        </button>
        <button 
          onClick={() => setActiveTab('postings')}
          className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === 'postings' ? 'bg-fuchsia-600 text-white' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'}`}
        >
          Public Job Postings
        </button>
      </div>

      {/* Content for Public Job Postings */}
      {activeTab === 'postings' && (
        <div className="space-y-6">
          {showForm && (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-4 max-w-2xl text-slate-800">
              <h2 className="text-xl font-bold text-slate-800">{editingJobId ? 'Edit Job Post' : 'Create a Public Job Post'}</h2>
              <div className="grid grid-cols-2 gap-4">
                <label className="block col-span-2">
                  <span className="text-sm font-semibold text-slate-500">Job Title</span>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. Part-time Nanny for 4yo" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-500">Child Age(s)</span>
                  <input required value={formData.child_age} onChange={e => setFormData({...formData, child_age: e.target.value})} className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. 4 and 6" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-500">Salary Offered ($/hr)</span>
                  <input type="number" required value={formData.salary_offered} onChange={e => setFormData({...formData, salary_offered: e.target.value})} className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. 20" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-500">Schedule</span>
                  <input required value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. Mon-Fri 9AM-5PM" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-500">Location</span>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. Downtown" />
                </label>
                <label className="block col-span-2">
                  <span className="text-sm font-semibold text-slate-500">Special Requirements</span>
                  <textarea value={formData.special_requirements} onChange={e => setFormData({...formData, special_requirements: e.target.value})} className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 min-h-24 text-slate-800" placeholder="e.g. Must have car, CPR certified" />
                </label>
              </div>
              <button type="submit" className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500 w-full transition shadow-lg shadow-emerald-500/20">
                {editingJobId ? 'Save Changes' : 'Submit Public Job Post'}
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-slate-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <span className="text-4xl mb-4 block">📝</span>
              <p className="text-lg font-bold text-slate-800 mb-2">No Public Postings Found</p>
              <p>Create a public job posting to have nannies apply to you.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (
                <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-fuchsia-500 transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditPost(job)} className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-700 rounded transition" title="Edit Post">✏️</button>
                      <button onClick={() => handleDeletePost(job.id)} className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition" title="Delete Post">🗑️</button>
                      <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full ${job.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-wider">Posted {new Date(job.created_at || new Date()).toLocaleDateString()}</p>
                  
                  <div className="space-y-3 text-sm text-slate-600">
                    <p className="flex justify-between"><span className="font-semibold text-slate-500">Children:</span> {job.child_age}</p>
                    <p className="flex justify-between"><span className="font-semibold text-slate-500">Pay:</span> ${job.salary_offered}/hr</p>
                    <p className="flex justify-between"><span className="font-semibold text-slate-500">Schedule:</span> {job.schedule}</p>
                    <p className="flex justify-between"><span className="font-semibold text-slate-500">Location:</span> {job.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for Direct Bookings */}
      {activeTab === 'direct' && (
        <div className="space-y-6">
          {directRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <span className="text-4xl mb-4 block">🤝</span>
              <p className="text-lg font-bold text-slate-800 mb-2">No Direct Bookings Yet</p>
              <p>When you send a job request directly to a nanny from their profile, it will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {directRequests.map(req => (
                <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-fuchsia-500 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl border border-fuchsia-500/30">
                        👶
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">{req.nannyName}</h3>
                        <p className="text-xs text-slate-500">Direct Request</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteDirectRequest(req.id)} className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-50 hover:bg-red-500/10 rounded transition" title="Delete Booking Record">🗑️</button>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        req.status === 'Booked' ? 'bg-indigo-500/20 text-fuchsia-600 border-fuchsia-500/30' :
                        req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        req.status === 'Cancelled' ? 'bg-slate-500/20 text-slate-500 border-slate-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-slate-600 flex-1 mb-6">
                    <p className="flex items-center gap-2">📅 <span className="text-slate-800 font-semibold">{req.date}</span></p>
                    <p className="flex items-center gap-2">🕒 <span className="text-slate-800 font-semibold">{req.time}</span></p>
                    <p className="mt-4 pt-4 border-t border-slate-200 text-slate-500 text-xs italic line-clamp-2">
                      "{req.description}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-slate-500">Sent {req.createdAt}</span>
                    {req.status === 'Approved' ? (
                      <button onClick={() => handleMakePayment(req)} className="text-emerald-400 text-sm font-bold hover:text-emerald-300 transition bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20">
                        💳 Make Payment
                      </button>
                    ) : req.status === 'Pending' ? (
                      <button onClick={() => handleCancelRequest(req.id)} className="text-slate-500 text-sm font-bold hover:text-slate-800 transition">Cancel Request</button>
                    ) : req.status === 'Booked' ? (
                      <span className="text-fuchsia-600 text-sm font-bold">Confirmed ✓</span>
                    ) : (
                      <button onClick={() => setSelectedRequest(req)} className="text-slate-500 text-sm font-bold hover:text-slate-800 transition">View Details</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-slate-50 p-6 flex justify-between items-start border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">Request Details</h3>
                <p className="text-slate-500 text-sm mt-1">Direct booking to {selectedRequest.nannyName}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-500 hover:text-slate-800 transition">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border inline-block ${
                  selectedRequest.status === 'Declined' || selectedRequest.status === 'Cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-500/20 text-slate-500 border-slate-500/30'
                }`}>
                  {selectedRequest.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</span>
                  <span className="text-slate-800 font-semibold">{selectedRequest.date}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Time</span>
                  <span className="text-slate-800 font-semibold">{selectedRequest.time}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</span>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  {selectedRequest.description}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedRequest(null)} className="px-6 py-2 bg-slate-50 hover:bg-slate-700 text-slate-800 rounded-xl font-semibold transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Payment Modal */}
      {paymentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl relative max-h-[90vh]">
            
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-slate-800">Processing Payment Securely</h3>
                <p className="text-slate-500 mt-2">Please do not close this window...</p>
              </div>
            )}

            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2"><span>💳</span> Secure Checkout</h3>
                {paymentStep < 3 && <p className="text-slate-500 text-sm mt-1">Booking {paymentData.nannyName}</p>}
              </div>
              {paymentStep < 3 && <button onClick={() => setPaymentData(null)} className="text-slate-500 hover:text-slate-800 transition w-8 h-8 flex items-center justify-center bg-slate-700/50 rounded-full shrink-0">✕</button>}
            </div>

            <div className="p-6 overflow-y-auto">
              {paymentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200 mb-6 flex justify-between items-center">
                    <div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Enter Amount to Pay ($)</p>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-800 font-black text-2xl">$</span>
                        <input 
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-3xl font-black text-slate-800 focus:outline-none focus:border-emerald-500 w-48 transition"
                        />
                      </div>
                    </div>
                    <div className="text-right mt-6">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Service</p>
                      <p className="text-fuchsia-600 font-bold">Booking Fee</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-slate-800 font-semibold mb-4">Select Payment Method</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['bKash', 'Nagad', 'Rocket', 'DBL', 'Credit Card'].map(method => (
                        <button 
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-4 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 ${
                            paymentMethod === method 
                              ? 'border-fuchsia-500 bg-indigo-500/20 text-indigo-300' 
                              : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          {method === 'Credit Card' ? '💳' : '📱'} {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod && (
                    <button 
                      onClick={() => setPaymentStep(2)}
                      className="w-full py-4 bg-fuchsia-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-500/20"
                    >
                      Continue with {paymentMethod} ➔
                    </button>
                  )}
                </div>
              )}

              {paymentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200 flex justify-between items-center mb-2">
                    <div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-emerald-400">${Number(customAmount || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Paying With</p>
                      <p className="text-slate-800 font-bold flex items-center gap-2">
                        {paymentMethod === 'Credit Card' ? '💳' : '📱'} {paymentMethod}
                      </p>
                    </div>
                    <button onClick={() => setPaymentStep(1)} className="text-fuchsia-600 text-sm font-semibold hover:text-indigo-300">Change</button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {paymentMethod === 'Credit Card' ? 'Card Number' : `${paymentMethod} Account Number`}
                    </label>
                    <input 
                      type="text" 
                      placeholder={paymentMethod === 'Credit Card' ? '0000 0000 0000 0000' : 'e.g. 01XXXXXXXXX'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500 font-mono"
                    />
                  </div>

                  {paymentMethod === 'Credit Card' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500 font-mono"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
                        <input type="password" placeholder="***" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500 font-mono"/>
                      </div>
                    </div>
                  )}

                  {paymentMethod !== 'Credit Card' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PIN / OTP</label>
                      <input type="password" placeholder="Enter PIN" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500 font-mono"/>
                    </div>
                  )}

                  <button 
                    onClick={processPayment}
                    disabled={!customAmount || Number(customAmount) <= 0}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>🔒</span> Pay ${Number(customAmount || 0).toFixed(2)} & Confirm Booking
                  </button>
                </div>
              )}

              {paymentStep === 3 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
                    ✓
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Payment Successful!</h2>
                  
                  {/* Payment Receipt Slip */}
                  <div id="payment-receipt" className="bg-slate-100 rounded-xl p-6 text-slate-800 text-left mb-8 shadow-inner border border-slate-300 relative overflow-hidden">
                    {/* Decorative receipt zig-zag top */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gZmlsbD0iIzFhMWMyZCIgcG9pbnRzPSIwLDAgMTAsMTAgMjAsMCAyMCwxMCAwLDEwIi8+PC9zdmc+')]"></div>
                    
                    <h3 className="font-black text-xl text-center mb-1 mt-2">PAYMENT RECEIPT</h3>
                    <p className="text-center text-slate-500 text-xs font-mono mb-6">Nanny Booking Services</p>
                    
                    <div className="space-y-3 font-mono text-sm border-y border-dashed border-slate-300 py-4 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transaction ID:</span>
                        <span className="font-bold">{transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="font-bold">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Paid To:</span>
                        <span className="font-bold">{paymentData.nannyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payment Method:</span>
                        <span className="font-bold">{paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold">TOTAL PAID:</span>
                      <span className="font-black text-emerald-600">${Number(customAmount || 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gZmlsbD0iIzFhMWMyZCIgcG9pbnRzPSIwLDAgMTAsMTAgMjAsMCAyMCwxMCAwLDEwIi8+PC9zdmc+')] rotate-180"></div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={downloadReceipt}
                      className="flex-1 py-4 bg-slate-50 hover:bg-slate-700 border border-slate-300 text-slate-800 font-bold rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <span>📥</span> Save Slip
                    </button>
                    <button 
                      onClick={() => setPaymentData(null)}
                      className="flex-1 py-4 bg-fuchsia-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-500/20"
                    >
                      Return Home
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}



