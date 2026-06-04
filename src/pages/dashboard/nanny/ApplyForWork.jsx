import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Baby, Heart, Check, Send, User, MessageCircle, X, Navigation, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';

export default function ApplyForWork() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDetails, setViewingDetails] = useState(null);
  const [messagingFamily, setMessagingFamily] = useState(null);
  const [messageText, setMessageText] = useState('');

  const filters = ['All', 'Full-time', 'Part-time', 'Live-in'];

  const initialJobs = [
    {
      id: 1,
      family: 'Ahmed Family',
      location: 'Gulshan 2, Dhaka',
      timeAgo: '2 hours ago',
      match: 94,
      childInfo: {
        age: '2 years old',
        personality: 'Active & Playful'
      },
      salary: {
        amount: '18,000 BDT/month',
        type: 'Full-time Live-out'
      },
      schedule: 'Mon-Fri, 8 AM - 6 PM',
      requirements: ['Infant care experience', 'Bangla & English', 'CPR certified'],
      isRecommended: true,
      applied: false,
      saved: false,
      aiReason: 'Matched because you have 2+ years of newborn experience and CPR certification.',
      details: 'We are a busy professional couple looking for a loving and energetic nanny for our 2-year-old son. He loves playing outdoors, building blocks, and reading storybooks. We need someone who can prepare healthy meals for him, handle his laundry, and keep his play area organized. CPR certification is a must.'
    },
    {
      id: 2,
      family: 'Rahman Family',
      location: 'Banani, Dhaka',
      timeAgo: '5 hours ago',
      match: 88,
      childInfo: {
        age: '8 months old',
        personality: 'Calm & Sweet'
      },
      salary: {
        amount: '15,000 BDT/month',
        type: 'Part-time Live-out'
      },
      schedule: 'Mon-Wed-Fri, 9 AM - 2 PM',
      requirements: ['Newborn experience', 'Patience', 'First Aid'],
      isRecommended: true,
      applied: false,
      saved: true,
      aiReason: 'Strong match with your requested part-time hours and infant care expertise.',
      details: 'Looking for a gentle and experienced part-time nanny for our 8-month-old infant. The primary duties include feeding, changing diapers, putting her down for naps, and engaging in age-appropriate developmental activities.'
    },
    {
      id: 3,
      family: 'Chowdhury Family',
      location: 'Dhanmondi, Dhaka',
      timeAgo: '1 day ago',
      match: null,
      childInfo: {
        age: '3 years old',
        personality: 'Curious & Talkative'
      },
      salary: {
        amount: '30,000 BDT/month',
        type: 'Live-in'
      },
      schedule: '6 days/week, Live-in',
      requirements: ['Live-in availability', 'References', 'Background check'],
      isRecommended: false,
      applied: false,
      saved: false,
      details: 'We are looking for a reliable full-time live-in nanny. You will be provided with a private room and all meals. Responsibilities include full care of our 3-year-old daughter, preparing her meals, and light housekeeping related to the child.'
    }
  ];

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // In a real app we'd fetch from api.get('/jobs/open')
      const response = await fetch('http://localhost:5001/api/jobs/open', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if(data.ok && data.data) {
        setJobs(data.data);
      } else {
        setJobs(initialJobs); // Fallback to initial mock if backend fails
      }
    } catch(err) {
      setJobs(initialJobs); // Fallback to initial mock if backend fails
    }
  };

  const handleApply = async (id) => {
    try {
      // In a real app we'd call api.post('/jobs/apply', { job_id: id })
      setJobs(jobs.map(job => 
        job.id === id ? { ...job, applied: true } : job
      ));
      alert('Applied successfully!');
    } catch(err) {
      alert('Error applying');
    }
  };

  const handleToggleSave = (id, e) => {
    e.stopPropagation();
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, saved: !job.saved } : job
    ));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if(!messageText.trim()) return;
    alert(`Message sent to ${messagingFamily.family}!`);
    setMessagingFamily(null);
    setMessageText('');
  };

  // Filter logic
  const filteredJobs = jobs.filter(job => {
    const searchString = `${job.family} ${job.location} ${job.salary.type}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    
    // Check pill filters against salary type string
    const matchesFilter = activeFilter === 'All' || job.salary.type.toLowerCase().includes(activeFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const recommendedJobs = filteredJobs.filter(job => job.isRecommended);
  const allJobsList = filteredJobs;

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          Job Feed <span className="text-2xl">💼</span>
        </h1>
        <p className="text-slate-500 mt-2">Browse and apply to parent job posts</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by family or location..." 
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {allJobsList.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md">
            
            {/* Top Row: Family, Location, Match Score */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[19px] font-bold text-slate-900">{job.family}</h3>
                  <button 
                    onClick={(e) => handleToggleSave(job.id, e)}
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    {job.saved ? (
                      <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-50" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.timeAgo}</span>
                </div>
              </div>
              {job.match && (
                <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl p-3 text-center min-w-[90px]">
                  <div className="flex items-center justify-center gap-1 text-blue-600 font-black text-xl">
                    <Heart className="w-5 h-5 fill-current" /> {job.match}%
                  </div>
                  <div className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">AI Match</div>
                </div>
              )}
            </div>

            {job.aiReason && (
              <div className="bg-[#fdf4ff] border border-[#f3e8ff] p-3 rounded-xl mb-6 text-[13px] text-[#a855f7] font-medium flex gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span><span className="font-bold">Why this job is recommended:</span> {job.aiReason}</span>
              </div>
            )}

            {/* Grid Data Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
              <div>
                <p className="text-xs text-slate-400 mb-1">Child Information</p>
                <p className="font-bold text-slate-900 text-[15px]">{job.childInfo.age}</p>
                <p className="text-sm text-slate-600">{job.childInfo.personality}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Salary & Type</p>
                <p className="font-bold text-slate-900 text-[15px]">$ {job.salary.amount}</p>
                <p className="text-sm text-slate-600">{job.salary.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Work Schedule</p>
                <p className="font-bold text-slate-900 text-[15px]">{job.schedule}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <p className="text-xs text-slate-400 mb-2">Requirements</p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map(req => (
                  <span key={req} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              {job.applied ? (
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                  <Check className="w-5 h-5" /> Applied Successfully
                </button>
              ) : (
                <button 
                  onClick={() => handleApply(job.id)}
                  className="flex-1 bg-[#1a56db] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="w-4 h-4" /> Quick Apply
                </button>
              )}
              <div className="flex gap-3 sm:w-auto w-full">
                <button 
                  onClick={() => setViewingDetails(job)}
                  className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
                <button 
                  onClick={() => setMessagingFamily(job)}
                  className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Send Message
                </button>
              </div>
            </div>

          </div>
        ))}

        {allJobsList.length === 0 && (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-lg">No jobs match your criteria.</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{viewingDetails.family}</h2>
                <p className="text-slate-500 text-sm mt-1">{viewingDetails.location}</p>
              </div>
              <button onClick={() => setViewingDetails(null)} className="p-2 bg-white hover:bg-slate-200 rounded-full text-slate-500 transition-colors border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h3 className="font-bold text-slate-900 mb-2">Job Description</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {viewingDetails.details}
              </p>

              <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl mb-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Salary</p>
                  <p className="font-bold text-slate-900">{viewingDetails.salary.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Schedule</p>
                  <p className="font-bold text-slate-900">{viewingDetails.schedule}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Child Age</p>
                  <p className="font-bold text-slate-900">{viewingDetails.childInfo.age}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Type</p>
                  <p className="font-bold text-slate-900">{viewingDetails.salary.type}</p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 mb-3">Required Qualifications</h3>
              <ul className="space-y-2 mb-2">
                {viewingDetails.requirements.map(req => (
                  <li key={req} className="flex items-center gap-2 text-slate-600 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white mt-auto">
              {viewingDetails.applied ? (
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> Applied
                </button>
              ) : (
                <button onClick={() => {
                  handleApply(viewingDetails.id);
                  setViewingDetails(null);
                }} className="flex-1 bg-[#1a56db] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
                  <Navigation className="w-4 h-4" /> Quick Apply
                </button>
              )}
              <button onClick={() => {
                setMessagingFamily(viewingDetails);
                setViewingDetails(null);
              }} className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50">
                Message Family
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {messagingFamily && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setMessagingFamily(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Message {messagingFamily.family}</h2>
              <p className="text-slate-500 mb-6 text-sm">Send a direct message to express your interest or ask questions about the role.</p>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <textarea 
                    required
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    placeholder={`Hi ${messagingFamily.family}, I'm very interested in your job posting...`}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1a56db] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
