import React, { useState } from 'react';
import { Star, Search, Filter, ShieldCheck, AlertTriangle } from 'lucide-react';
import api from '../../../services/api';

export default function AdminReviews() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const [mockReviews, setMockReviews] = useState([
    { id: 1, reviewer: 'Sarah Johnson', reviewerRole: 'Parent', targetId: 2, target: 'Happy Kids Academy', targetRole: 'Daycare', rating: 5, comment: 'Excellent daycare! My kids love it here.', status: 'Published', date: '2026-06-08' },
    { id: 2, reviewer: 'Michael Brown', reviewerRole: 'Parent', targetId: 3, target: 'Nina Williams', targetRole: 'Nanny', rating: 1, comment: 'Never showed up on time. Very unprofessional.', status: 'Flagged', date: '2026-06-07' },
    { id: 3, reviewer: 'Alice Smith', reviewerRole: 'Parent', targetId: 4, target: 'Bob Toys Emporium', targetRole: 'Seller', rating: 4, comment: 'Good quality toys, fast shipping.', status: 'Published', date: '2026-06-05' },
    { id: 4, reviewer: 'Jessica Parker', reviewerRole: 'Nanny', targetId: 5, target: 'John Doe', targetRole: 'Parent', rating: 5, comment: 'Great family to work with. Very respectful.', status: 'Published', date: '2026-06-04' },
    { id: 5, reviewer: 'Emma Watson', reviewerRole: 'Parent', targetId: 6, target: 'Global Child Rescue', targetRole: 'Adoption', rating: 2, comment: 'Communication was very poor during the process.', status: 'Published', date: '2026-06-02' },
  ]);

  const handleReviewAction = (reviewId, action) => {
    setMockReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        if (action === 'delete') return null;
        if (action === 'approve') return { ...r, status: 'Published' };
        if (action === 'flag') return { ...r, status: 'Flagged' };
      }
      return r;
    }).filter(Boolean));
    alert(`Review ${action}d successfully`);
  };

  const handleUserAction = async (targetId, actionName) => {
    try {
      await api.put(`/admin/users/${targetId}/action`, { action: actionName });
      alert(`User has been ${actionName}ed successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to take action: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.target.toLowerCase().includes(search.toLowerCase()) || review.reviewer.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'All' || review.targetRole === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" /> Platform Reviews & Ratings
          </h1>
          <p className="text-slate-500 font-medium mt-2">Monitor user feedback, maintain quality standards, and moderate flagged reviews.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none w-full md:w-64 font-medium shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none appearance-none font-medium shadow-sm cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Nanny">Nannies</option>
              <option value="Daycare">Daycares</option>
              <option value="Seller">Sellers</option>
              <option value="Adoption">Adoption Orgs</option>
              <option value="Parent">Parents</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Reviewer</th>
                <th className="py-4 px-6">Target</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Comment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">No reviews found matching your criteria.</td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 text-slate-500 font-medium">{review.date}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{review.reviewer}</p>
                      <p className="text-xs text-slate-500">{review.reviewerRole}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{review.target}</p>
                      <p className="text-xs text-slate-500">{review.targetRole}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 ${review.rating >= 1 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                        <Star className={`w-4 h-4 ${review.rating >= 2 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                        <Star className={`w-4 h-4 ${review.rating >= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                        <Star className={`w-4 h-4 ${review.rating >= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                        <Star className={`w-4 h-4 ${review.rating >= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-700 max-w-xs truncate" title={review.comment}>"{review.comment}"</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider w-fit ${review.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {review.status === 'Published' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} {review.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 relative group/action">
                        {/* Review Actions */}
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                          {review.status === 'Flagged' ? (
                            <button onClick={() => handleReviewAction(review.id, 'approve')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition" title="Approve Review">Approve</button>
                          ) : (
                            <button onClick={() => handleReviewAction(review.id, 'flag')} className="px-3 py-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-bold transition" title="Flag Review">Flag</button>
                          )}
                          <button onClick={() => handleReviewAction(review.id, 'delete')} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition" title="Delete Review">Delete</button>
                        </div>
                        
                        {/* User Moderation Actions */}
                        <div className="relative">
                          <button className="px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm">
                            Take Action
                          </button>
                          
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-50">
                            <div className="p-2 flex flex-col gap-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">Against {review.targetRole}</p>
                              <button onClick={() => handleUserAction(review.targetId, 'notice')} className="text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition flex items-center gap-2">
                                <AlertTriangle className="w-3.5 h-3.5" /> Give Notice
                              </button>
                              <button onClick={() => handleUserAction(review.targetId, 'suspend')} className="text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition flex items-center gap-2">
                                <AlertTriangle className="w-3.5 h-3.5" /> Suspend (Temp)
                              </button>
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button onClick={() => handleUserAction(review.targetId, 'ban')} className="text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2">
                                <AlertTriangle className="w-3.5 h-3.5" /> Ban (Permanent)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
