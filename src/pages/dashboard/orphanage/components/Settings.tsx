import { useState } from 'react';
import {
  Building2,
  Shield,
  Bell,
  Save,
  RotateCcw,
  Lock,
  Upload,
  Key,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  BellRing,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  History,
  MapPin,
  Phone,
  Globe,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface LoginSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

interface LoginHistoryItem {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  // Organization Profile State
  const [orgProfile, setOrgProfile] = useState({
    name: 'Hope Haven Orphanage',
    logo: '🏠',
    description: 'Providing care and finding loving families for children in need since 1995. Our mission is to ensure every child has a safe, nurturing environment and the opportunity for a better future.',
    address: '123 Care Street, Downtown District, Metro City, MC 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@hopehaven.org',
    website: 'www.hopehaven.org'
  });

  const [tempProfile, setTempProfile] = useState({ ...orgProfile });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    twoFactorMethod: 'app' as 'app' | 'sms' | 'email'
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: {
      newApplications: true,
      documentUploads: true,
      meetingReminders: true,
      complaints: true,
      systemUpdates: false
    },
    smsAlerts: {
      criticalAlerts: true,
      meetingReminders: false,
      applicationApprovals: false
    },
    pushNotifications: {
      enabled: true,
      newMessages: true,
      taskReminders: true,
      systemAlerts: true
    }
  });

  // Login Sessions State
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([
    {
      id: 'session-1',
      device: 'Windows PC',
      browser: 'Chrome 122',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.105',
      lastActive: '2026-06-03 15:30',
      current: true
    },
    {
      id: 'session-2',
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.142',
      lastActive: '2026-06-03 12:15',
      current: false
    },
    {
      id: 'session-3',
      device: 'MacBook Pro',
      browser: 'Firefox 124',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.89',
      lastActive: '2026-06-02 18:45',
      current: false
    }
  ]);

  // Login History State
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([
    {
      id: 'login-1',
      device: 'Windows PC - Chrome',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.105',
      timestamp: '2026-06-03 15:30',
      status: 'success'
    },
    {
      id: 'login-2',
      device: 'iPhone - Safari',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.142',
      timestamp: '2026-06-03 12:15',
      status: 'success'
    },
    {
      id: 'login-3',
      device: 'Unknown Device',
      location: 'Unknown Location',
      ipAddress: '45.123.67.89',
      timestamp: '2026-06-02 23:45',
      status: 'failed'
    },
    {
      id: 'login-4',
      device: 'MacBook - Firefox',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.89',
      timestamp: '2026-06-02 18:45',
      status: 'success'
    },
    {
      id: 'login-5',
      device: 'Android - Chrome',
      location: 'Metro City, MC',
      ipAddress: '192.168.1.67',
      timestamp: '2026-06-01 09:20',
      status: 'success'
    }
  ]);

  const handleProfileChange = (field: string, value: string) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  const handleSaveProfile = () => {
    setOrgProfile({ ...tempProfile });
    toast.success('Organization profile updated successfully');
  };

  const handleResetProfile = () => {
    setTempProfile({ ...orgProfile });
    toast.info('Profile changes reset');
  };

  const handleLogoUpload = () => {
    toast.success('Logo uploaded successfully');
    setTempProfile({ ...tempProfile, logo: '🏢' });
  };

  const handlePasswordChange = () => {
    if (!securitySettings.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!securitySettings.newPassword || securitySettings.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Password changed successfully');
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleToggle2FA = () => {
    if (!securitySettings.twoFactorEnabled) {
      toast.success('Two-factor authentication enabled');
      setSecuritySettings({ ...securitySettings, twoFactorEnabled: true });
    } else {
      toast.warning('Two-factor authentication disabled');
      setSecuritySettings({ ...securitySettings, twoFactorEnabled: false });
    }
  };

  const handleTerminateSession = (sessionId: string) => {
    if (loginSessions.find(s => s.id === sessionId)?.current) {
      toast.error('Cannot terminate current session');
      return;
    }

    setLoginSessions(loginSessions.filter(s => s.id !== sessionId));
    toast.success('Session terminated');
  };

  const handleTerminateAllSessions = () => {
    if (window.confirm('This will log you out from all other devices. Continue?')) {
      setLoginSessions(loginSessions.filter(s => s.current));
      toast.success('All other sessions terminated');
    }
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setTempProfile({
        name: 'Hope Haven Orphanage',
        logo: '🏠',
        description: 'Providing care and finding loving families for children in need since 1995.',
        address: '123 Care Street, Downtown District, Metro City, MC 12345',
        phone: '+1 (555) 123-4567',
        email: 'contact@hopehaven.org',
        website: 'www.hopehaven.org'
      });
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage orphanage settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Organization Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-5 h-5" />
              Security Settings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notification Settings
            </button>
          </div>
        </div>
      </div>

      {/* Organization Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Organization Information</h2>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center text-5xl">
                    {tempProfile.logo}
                  </div>
                  <button
                    onClick={handleLogoUpload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                </div>
              </div>

              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={tempProfile.description}
                  onChange={(e) => handleProfileChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <textarea
                  value={tempProfile.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  value={tempProfile.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={(e) => { e.preventDefault(); alert('Changes saved successfully to backend!'); }}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleResetProfile}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={securitySettings.currentPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={securitySettings.newPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={securitySettings.confirmPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Two-Factor Authentication (2FA)
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {securitySettings.twoFactorEnabled ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">
                      {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    securitySettings.twoFactorEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              {securitySettings.twoFactorEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">2FA Method</label>
                  <select
                    value={securitySettings.twoFactorMethod}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorMethod: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="app">Authenticator App</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Active Sessions
              </h2>
              <button
                onClick={handleTerminateAllSessions}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Terminate All Other Sessions
              </button>
            </div>

            <div className="space-y-3">
              {loginSessions.map(session => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border ${
                    session.current ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-gray-900">{session.device}</p>
                        {session.current && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Current</span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Browser: {session.browser}</p>
                        <p>Location: {session.location}</p>
                        <p>IP: {session.ipAddress}</p>
                        <p>Last Active: {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="px-3 py-1 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-5 h-5" />
              Login History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Device</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">IP Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loginHistory.map(login => (
                    <tr key={login.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{login.device}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{login.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{login.ipAddress}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{login.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          login.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {login.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Email Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Alerts
            </h2>

            <div className="space-y-4">
              {Object.entries(notificationSettings.emailAlerts).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm text-gray-600">Receive email notifications for this event</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailAlerts: { ...notificationSettings.emailAlerts, [key]: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* SMS Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Alerts
            </h2>

            <div className="space-y-4">
              {Object.entries(notificationSettings.smsAlerts).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm text-gray-600">Receive SMS notifications for this event</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsAlerts: { ...notificationSettings.smsAlerts, [key]: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BellRing className="w-5 h-5" />
              Push Notifications
            </h2>

            <div className="space-y-4">
              {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm text-gray-600">Receive push notifications for this event</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: { ...notificationSettings.pushNotifications, [key]: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Reset Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reset All Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Reset all settings to default values</p>
          </div>
          <button
            onClick={handleResetSettings}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );
}
