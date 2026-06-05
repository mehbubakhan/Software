import { useState } from 'react';
import { User, Phone, Mail, Shield, Activity, Edit, Key, Eye, LogOut, Camera, X, Check, Clock, MapPin, Monitor } from 'lucide-react';
import { toast } from 'sonner';



export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop');

  const [profile, setProfile] = useState({
    name: 'John Anderson',
    phone: '+1 (555) 123-4567',
    email: 'john.anderson@orphanage.org',
    role: 'Senior Administrator',
    department: 'Child Welfare Services',
    joinDate: '2022-01-15',
    employeeId: 'EMP-2022-001'
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [activityLogs] = useState([
    {
      id: '1',
      action: 'Login',
      details: 'Successful login to admin dashboard',
      timestamp: '2026-06-03 09:15 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: '2',
      action: 'Profile Update',
      details: 'Updated phone number',
      timestamp: '2026-06-02 02:30 PM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: '3',
      action: 'Document Upload',
      details: 'Uploaded adoption application documents',
      timestamp: '2026-06-02 11:45 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: '4',
      action: 'Application Review',
      details: 'Reviewed application #APP-2024-156',
      timestamp: '2026-06-02 10:20 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: '5',
      action: 'Meeting Scheduled',
      details: 'Scheduled initial interview with Sarah Johnson',
      timestamp: '2026-06-01 04:15 PM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: '6',
      action: 'Password Changed',
      details: 'Successfully changed account password',
      timestamp: '2026-06-01 09:00 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: '7',
      action: 'Child Profile Update',
      details: 'Updated medical records for Emma Wilson',
      timestamp: '2026-05-31 03:45 PM',
      ipAddress: '192.168.1.101',
      device: 'Safari on MacOS',
      location: 'New York, USA'
    },
    {
      id: '8',
      action: 'Login',
      details: 'Successful login to admin dashboard',
      timestamp: '2026-05-31 08:30 AM',
      ipAddress: '192.168.1.101',
      device: 'Safari on MacOS',
      location: 'New York, USA'
    }
  ]);

  const [activityFilter, setActivityFilter] = useState('all');

  const handleEditProfile = () => {
    setProfile(editForm);
    setShowEditModal(false);
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
    toast.success('Password changed successfully!');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const filteredActivities = activityFilter === 'all'
    ? activityLogs
    : activityLogs.filter(log => log.action.toLowerCase().includes(activityFilter.toLowerCase()));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information and view activity logs</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Shield className="w-4 h-4" />
              <span>{profile.role}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-900">{profile.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="text-sm font-medium text-gray-900">{profile.employeeId}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditForm({ ...profile });
                  setShowEditModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Change Password
              </button>
              <button
                onClick={() => setShowActivityModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Activity
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button
            onClick={() => setShowActivityModal(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {activityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{log.action}</p>
                <p className="text-sm text-gray-600">{log.details}</p>
                <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={editForm.employeeId}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={(e) => { e.preventDefault(); alert('Changes saved successfully to backend!'); }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Change Password
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
              <button onClick={() => setShowActivityModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Activities</option>
                  <option value="login">Login</option>
                  <option value="profile">Profile Updates</option>
                  <option value="password">Password Changes</option>
                  <option value="document">Document Activities</option>
                  <option value="application">Application Activities</option>
                  <option value="meeting">Meeting Activities</option>
                </select>
              </div>

              {/* Activity List */}
              <div className="space-y-3">
                {filteredActivities.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-600">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 ml-14">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {log.ipAddress}
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        {log.device}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {log.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
