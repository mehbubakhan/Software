import { useState } from 'react';
import { Users, UserPlus, CheckCircle, Clock, TrendingUp, DollarSign, Building, Shield, Calendar, ClipboardList, BarChart, FileText, AlertCircle, Phone, X, Edit, Eye, Trash2, Plus, Search, Filter, Download, Upload, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';









export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [staffList, setStaffList] = useState([
    {
      id: 'ST001',
      name: 'Dr. Sarah Johnson',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      department: 'Medical',
      role: 'Doctor',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@orphanage.org',
      status: 'active',
      shift: 'Morning',
      joinDate: '2023-01-15',
      salary: 75000,
      attendance: 96
    },
    {
      id: 'ST002',
      name: 'Michael Chen',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      department: 'Education',
      role: 'Teacher',
      phone: '+1 (555) 234-5678',
      email: 'michael.c@orphanage.org',
      status: 'active',
      shift: 'Morning',
      joinDate: '2023-03-20',
      salary: 55000,
      attendance: 94
    },
    {
      id: 'ST003',
      name: 'Emily Rodriguez',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      department: 'Child Care',
      role: 'Caretaker',
      phone: '+1 (555) 345-6789',
      email: 'emily.r@orphanage.org',
      status: 'on-leave',
      shift: 'Evening',
      joinDate: '2022-11-10',
      salary: 45000,
      attendance: 89
    },
    {
      id: 'ST004',
      name: 'James Wilson',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      department: 'Security',
      role: 'Security Guard',
      phone: '+1 (555) 456-7890',
      email: 'james.w@orphanage.org',
      status: 'active',
      shift: 'Night',
      joinDate: '2023-02-05',
      salary: 42000,
      attendance: 98
    },
    {
      id: 'ST005',
      name: 'Lisa Martinez',
      photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
      department: 'Medical',
      role: 'Nurse',
      phone: '+1 (555) 567-8901',
      email: 'lisa.m@orphanage.org',
      status: 'active',
      shift: 'Morning',
      joinDate: '2023-04-12',
      salary: 52000,
      attendance: 95
    }
  ]);

  const [departments, setDepartments] = useState([
    { id: 'D001', name: 'Child Care', manager: 'Emily Rodriguez', staffCount: 12, description: 'Primary child care and supervision' },
    { id: 'D002', name: 'Medical', manager: 'Dr. Sarah Johnson', staffCount: 8, description: 'Healthcare and medical services' },
    { id: 'D003', name: 'Education', manager: 'Michael Chen', staffCount: 10, description: 'Educational programs and tutoring' },
    { id: 'D004', name: 'Security', manager: 'James Wilson', staffCount: 6, description: 'Facility security and safety' },
    { id: 'D005', name: 'Administration', manager: 'John Anderson', staffCount: 5, description: 'Administrative operations' },
    { id: 'D006', name: 'Kitchen', manager: 'Maria Garcia', staffCount: 7, description: 'Food preparation and nutrition' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'T001', title: 'Conduct medical checkup for new children', assignedTo: 'Dr. Sarah Johnson', priority: 'high', deadline: '2026-06-05', status: 'in-progress' },
    { id: 'T002', title: 'Prepare monthly education report', assignedTo: 'Michael Chen', priority: 'medium', deadline: '2026-06-10', status: 'pending' },
    { id: 'T003', title: 'Security patrol schedule update', assignedTo: 'James Wilson', priority: 'high', deadline: '2026-06-04', status: 'completed' },
    { id: 'T004', title: 'Review child care protocols', assignedTo: 'Emily Rodriguez', priority: 'low', deadline: '2026-06-15', status: 'pending' }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR001', staffName: 'Emily Rodriguez', type: 'Sick Leave', duration: '3 days', reason: 'Medical appointment and recovery', status: 'pending', date: '2026-06-03' },
    { id: 'LR002', staffName: 'Michael Chen', type: 'Vacation', duration: '5 days', reason: 'Family vacation', status: 'approved', date: '2026-05-28' },
    { id: 'LR003', staffName: 'Lisa Martinez', type: 'Emergency Leave', duration: '1 day', reason: 'Family emergency', status: 'approved', date: '2026-06-01' }
  ]);

  const stats = {
    totalStaff: staffList.length,
    activeStaff: staffList.filter(s => s.status === 'active').length,
    onLeave: staffList.filter(s => s.status === 'on-leave').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    attendanceRate: Math.round(staffList.reduce((acc, s) => acc + s.attendance, 0) / staffList.length),
    pendingSalaries: 2
  };

  const handleAddStaff = (formData) => {
    const newStaff: Staff = {
      id: `ST${String(staffList.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'active',
      attendance: 100
    };
    setStaffList([...staffList, newStaff]);
    setShowModal(null);
    toast.success('Staff member added successfully!');
  };

  const handleEditStaff = (staff: Staff, updates: Partial<Staff>) => {
    setStaffList(staffList.map(s => s.id === staff.id ? { ...s, ...updates } : s));
    setShowModal(null);
    toast.success('Staff updated successfully!');
  };

  const handleDeleteStaff = (id) => {
    setStaffList(staffList.filter(s => s.id !== id));
    toast.success('Staff removed successfully!');
  };

  const handleSuspendStaff = (id) => {
    setStaffList(staffList.map(s => s.id === id ? { ...s, status: 'suspended' } : s));
    toast.warning('Staff suspended');
  };

  const handleApproveLeave = (id) => {
    setLeaveRequests(leaveRequests.map(lr => lr.id === id ? { ...lr, status: 'approved' } : lr));
    toast.success('Leave request approved!');
  };

  const handleRejectLeave = (id) => {
    setLeaveRequests(leaveRequests.map(lr => lr.id === id ? { ...lr, status: 'rejected' } : lr));
    toast.error('Leave request rejected');
  };

  const handleAssignTask = (taskData) => {
    const newTask: Task = {
      id: `T${String(tasks.length + 1).padStart(3, '0')}`,
      ...taskData,
      status: 'pending'
    };
    setTasks([...tasks, newTask]);
    setShowModal(null);
    toast.success('Task assigned successfully!');
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    toast.success('Task marked as completed!');
  };

  const handleGeneratePayroll = () => {
    toast.success('Payroll generated successfully!', {
      description: 'Monthly payroll report has been created'
    });
  };

  const handleMarkAttendance = () => {
    toast.success('Attendance marked!', {
      description: 'Today\'s attendance has been recorded'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'on-leave': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600 mt-1">HR, attendance, payroll, and performance management</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart },
              { id: 'all-staff', label: 'All Staff', icon: Users },
              { id: 'departments', label: 'Departments', icon: Building },
              { id: 'roles', label: 'Roles & Permissions', icon: Shield },
              { id: 'attendance', label: 'Attendance', icon: CheckCircle },
              { id: 'shifts', label: 'Shifts & Schedule', icon: Calendar },
              { id: 'tasks', label: 'Tasks', icon: ClipboardList },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'payroll', label: 'Payroll', icon: DollarSign },
              { id: 'leave', label: 'Leave Requests', icon: Clock },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Staff</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeStaff}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">On Leave</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.onLeave}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Salaries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingSalaries}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-5 gap-4">
              <button
                onClick={() => setShowModal('add-staff')}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
              >
                <UserPlus className="w-5 h-5" />
                Add Staff
              </button>
              <button
                onClick={() => setShowModal('assign-task')}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center"
              >
                <ClipboardList className="w-5 h-5" />
                Assign Task
              </button>
              <button
                onClick={() => setShowModal('create-shift')}
                className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 justify-center"
              >
                <Calendar className="w-5 h-5" />
                Create Shift
              </button>
              <button
                onClick={() => setActiveTab('leave')}
                className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 justify-center"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Leave
              </button>
              <button
                onClick={handleGeneratePayroll}
                className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 justify-center"
              >
                <DollarSign className="w-5 h-5" />
                Generate Payroll
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {[
                { type: 'New staff joined', staff: 'Lisa Martinez', time: '2 hours ago', icon: UserPlus, color: 'bg-green-100 text-green-600' },
                { type: 'Shift changed', staff: 'James Wilson', time: '4 hours ago', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
                { type: 'Leave request', staff: 'Emily Rodriguez', time: '5 hours ago', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
                { type: 'Task completed', staff: 'Dr. Sarah Johnson', time: '1 day ago', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
                { type: 'Attendance alert', staff: 'Multiple staff', time: '1 day ago', icon: AlertCircle, color: 'bg-red-100 text-red-600' }
              ].map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.staff}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff Status Widget */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Online Staff</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeStaff}</p>
              <p className="text-sm text-gray-600 mt-1">Currently working</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Absent Staff</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.onLeave}</p>
              <p className="text-sm text-gray-600 mt-1">On leave today</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Emergency Alerts</h3>
              <p className="text-3xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-600 mt-1">No active alerts</p>
            </div>
          </div>
        </div>
      )}

      {/* All Staff Tab */}
      {activeTab === 'all-staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">All Staff Members</h2>
              <button
                onClick={() => setShowModal('add-staff')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Staff
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, ID, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Staff ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Photo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Shift</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffList.map(staff => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{staff.id}</td>
                      <td className="px-4 py-3">
                        <img src={staff.photo} alt={staff.name} className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{staff.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{staff.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{staff.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{staff.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{staff.shift}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowModal('view-profile');
                            }}
                            className="text-blue-600 hover:text-blue-700"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowModal('edit-staff');
                            }}
                            className="text-green-600 hover:text-green-700"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendStaff(staff.id)}
                            className="text-yellow-600 hover:text-yellow-700"
                            title="Suspend"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Departments</h2>
              <button
                onClick={() => setShowModal('add-department')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {departments.map(dept => (
                <div key={dept.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{dept.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Manager</p>
                      <p className="font-medium text-gray-900">{dept.manager}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Staff</p>
                      <p className="font-medium text-gray-900">{dept.staffCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Roles & Permissions</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { role: 'Caretaker', permissions: ['View children', 'Update child records', 'Schedule activities'] },
                { role: 'Teacher', permissions: ['View children', 'Upload education reports', 'Schedule classes'] },
                { role: 'Doctor', permissions: ['View children', 'Update medical records', 'Schedule checkups'] },
                { role: 'Nurse', permissions: ['View children', 'Update medical records', 'Manage medications'] },
                { role: 'Security Guard', permissions: ['View visitors', 'Manage facility access', 'Report incidents'] },
                { role: 'Accountant', permissions: ['View financial records', 'Process payments', 'Generate reports'] }
              ].map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">{item.role}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.permissions.map((perm, pidx) => (
                      <li key={pidx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                    Edit Permissions
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Attendance Management</h2>
              <button
                onClick={handleMarkAttendance}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Attendance
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Staff Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Check-In</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Check-Out</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hours Worked</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Late Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffList.map(staff => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{staff.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">08:00 AM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">05:00 PM</td>
                      <td className="px-4 py-3 text-sm text-gray-600">9 hours</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          On Time
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{staff.attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Shifts Tab */}
      {activeTab === 'shifts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Shifts & Schedule</h2>
              <button
                onClick={() => setShowModal('create-shift')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Shift
              </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {[
                { name: 'Morning Shift', time: '06:00 AM - 02:00 PM', staff: 15, color: 'bg-blue-100 text-blue-600' },
                { name: 'Evening Shift', time: '02:00 PM - 10:00 PM', staff: 12, color: 'bg-purple-100 text-purple-600' },
                { name: 'Night Shift', time: '10:00 PM - 06:00 AM', staff: 8, color: 'bg-indigo-100 text-indigo-600' },
                { name: 'Emergency Shift', time: 'On-Call 24/7', staff: 5, color: 'bg-red-100 text-red-600' }
              ].map((shift, idx) => (
                <div key={idx} className={`rounded-lg p-6 ${shift.color}`}>
                  <h3 className="font-bold text-lg mb-2">{shift.name}</h3>
                  <p className="text-sm mb-3">{shift.time}</p>
                  <p className="text-2xl font-bold">{shift.staff} Staff</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Task Management</h2>
              <button
                onClick={() => setShowModal('assign-task')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Assign Task
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Task Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Deadline</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{task.assignedTo}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{task.deadline}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Reports</h2>
            <div className="grid grid-cols-3 gap-6">
              {staffList.slice(0, 6).map(staff => (
                <div key={staff.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={staff.photo} alt={staff.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.role}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Attendance</span>
                        <span className="font-medium">{staff.attendance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${staff.attendance}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Task Completion</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Performance Score</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    View Full Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Salary & Payroll</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleGeneratePayroll}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Generate Payroll
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Staff Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Base Salary</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Bonus</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Deductions</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Net Salary</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffList.map(staff => {
                    const bonus = Math.round(staff.salary * 0.1);
                    const deductions = Math.round(staff.salary * 0.05);
                    const netSalary = staff.salary + bonus - deductions;
                    return (
                      <tr key={staff.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{staff.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">${staff.salary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-green-600">+${bonus.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-600">-${deductions.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">${netSalary.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Paid
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Payslip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leave Requests Tab */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Requests</h2>
            <div className="space-y-4">
              {leaveRequests.map(leave => (
                <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{leave.staffName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Type:</span> {leave.type}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Duration:</span> {leave.duration}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Date:</span> {leave.date}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {leave.reason}
                      </p>
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveLeave(leave.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectLeave(leave.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Staff Documents</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { type: 'Contracts', count: 48, icon: FileText, color: 'bg-blue-100 text-blue-600' },
                { type: 'Certificates', count: 35, icon: FileText, color: 'bg-green-100 text-green-600' },
                { type: 'Medical Reports', count: 28, icon: FileText, color: 'bg-purple-100 text-purple-600' },
                { type: 'Police Clearance', count: 42, icon: FileText, color: 'bg-orange-100 text-orange-600' },
                { type: 'ID Documents', count: 48, icon: FileText, color: 'bg-red-100 text-red-600' },
                { type: 'Licenses', count: 22, icon: FileText, color: 'bg-indigo-100 text-indigo-600' }
              ].map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div key={idx} className={`rounded-lg p-6 ${doc.color}`}>
                    <Icon className="w-8 h-8 mb-3" />
                    <h3 className="font-bold text-lg mb-1">{doc.type}</h3>
                    <p className="text-2xl font-bold">{doc.count}</p>
                    <button className="mt-3 text-sm font-medium hover:underline">View All</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showModal === 'add-staff' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Add New Staff</h2>
              <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddStaff({
                  name: formData.get('name'),
                  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                  department: formData.get('department'),
                  role: formData.get('role'),
                  phone: formData.get('phone'),
                  email: formData.get('email'),
                  shift: formData.get('shift'),
                  joinDate: formData.get('joinDate'),
                  salary: Number(formData.get('salary'))
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input name="name" required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input name="email" required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input name="phone" required type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select name="department" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {departments.map(d => <option key={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input name="role" required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                    <select name="shift" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Morning</option>
                      <option>Evening</option>
                      <option>Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                    <input name="joinDate" required type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <input name="salary" required type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Staff
                  </button>
                  <button type="button" onClick={() => setShowModal(null)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showModal === 'assign-task' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Assign New Task</h2>
              <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAssignTask({
                  title: formData.get('title'),
                  assignedTo: formData.get('assignedTo'),
                  priority: formData.get('priority'),
                  deadline: formData.get('deadline')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input name="title" required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                    <select name="assignedTo" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {staffList.map(s => <option key={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select name="priority" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input name="deadline" required type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Assign Task
                  </button>
                  <button type="button" onClick={() => setShowModal(null)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
