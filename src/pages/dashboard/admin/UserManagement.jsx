import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data?.ok) setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/admin/users/${id}/action`, { action });
      setOpenDropdownId(null);
      fetchUsers();
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.role?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch(role) {
      case 'parent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'nanny': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'daycare': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'admin': return 'bg-slate-800 text-white border-slate-900';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-2">Manage all registered parents, nannies, and daycares.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                <th className="py-4 px-6">User ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">No users found matching your search.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">#{user.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-md text-[11px] uppercase tracking-wider font-black border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      <div>{user.email}</div>
                      <div className="font-mono mt-1 text-xs">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                        className="p-2 text-slate-400 hover:text-slate-900 transition"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {openDropdownId === user.id && (
                        <div className="absolute right-6 top-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => handleAction(user.id, 'notice')}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            Send Notice
                          </button>
                          <button 
                            onClick={() => handleAction(user.id, 'suspend')}
                            className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 font-medium flex items-center gap-2"
                          >
                            <ShieldAlert className="w-4 h-4" /> Suspend User
                          </button>
                          <button 
                            onClick={() => handleAction(user.id, 'ban')}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                          >
                            <Ban className="w-4 h-4" /> Ban User
                          </button>
                        </div>
                      )}
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
