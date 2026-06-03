import { useState } from 'react';
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Plus,
  Upload,
  Send,
  TrendingUp,
  TrendingDown,
  Clock,
  MessageCircle,
  Heart,
  FileCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';



export default function DashboardHome({ onQuickAction }: DashboardHomeProps) {
  const [selectedCard, setSelectedCard] = useState(null);

  const summaryCards = [
    { id: 'total-children', label: 'Total Children', value: 148, icon: Users, color: 'bg-blue-500', change: '+5', trend: 'up' },
    { id: 'available', label: 'Available for Adoption', value: 43, icon: Heart, color: 'bg-green-500', change: '-3', trend: 'down' },
    { id: 'pending-apps', label: 'Pending Applications', value: 27, icon: FileText, color: 'bg-yellow-500', change: '+8', trend: 'up' },
    { id: 'approved-apps', label: 'Approved Applications', value: 64, icon: CheckCircle, color: 'bg-emerald-500', change: '+12', trend: 'up' },
    { id: 'rejected-apps', label: 'Rejected Applications', value: 15, icon: XCircle, color: 'bg-red-500', change: '+2', trend: 'up' },
    { id: 'upcoming-meetings', label: 'Upcoming Meetings', value: 18, icon: Calendar, color: 'bg-purple-500', change: '+4', trend: 'up' },
    { id: 'pending-verifications', label: 'Pending Verifications', value: 12, icon: ShieldCheck, color: 'bg-orange-500', change: '-1', trend: 'down' },
    { id: 'complaints', label: 'Active Complaints', value: 3, icon: AlertCircle, color: 'bg-pink-500', change: '-2', trend: 'down' },
  ];

  const quickActions = [
    { id: 'add-child', label: 'Add Child', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'schedule-meeting', label: 'Schedule Meeting', icon: Calendar, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'start-counselling', label: 'Start Counselling', icon: MessageCircle, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'verify-documents', label: 'Verify Documents', icon: FileCheck, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'upload-report', label: 'Upload Report', icon: Upload, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { id: 'send-notification', label: 'Send Notification', icon: Send, color: 'bg-pink-600 hover:bg-pink-700' },
  ];

  const recentActivities = [
    { id: 1, type: 'application', message: 'New adoption application from John & Mary Smith', time: '5 minutes ago', status: 'new' },
    { id: 2, type: 'document', message: 'Medical certificate uploaded for Emma Johnson', time: '15 minutes ago', status: 'pending' },
    { id: 3, type: 'approval', message: 'Parents David & Sarah Williams approved', time: '1 hour ago', status: 'approved' },
    { id: 4, type: 'meeting', message: 'Counselling session scheduled with Brown family', time: '2 hours ago', status: 'scheduled' },
    { id: 5, type: 'bonding', message: 'Trial bonding completed successfully - Case #2453', time: '3 hours ago', status: 'completed' },
    { id: 6, type: 'application', message: 'New application from Robert & Lisa Martinez', time: '4 hours ago', status: 'new' },
    { id: 7, type: 'document', message: 'Home study report uploaded - Case #2401', time: '5 hours ago', status: 'pending' },
    { id: 8, type: 'meeting', message: 'Home visit completed for Anderson family', time: '6 hours ago', status: 'completed' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Home Visit - Smith Family', type: 'meeting', date: '2026-06-04', time: '10:00 AM', priority: 'high' },
    { id: 2, title: 'Counselling Session - Johnson Family', type: 'counselling', date: '2026-06-04', time: '2:00 PM', priority: 'medium' },
    { id: 3, title: 'Document Review - Case #2456', type: 'review', date: '2026-06-05', time: '9:00 AM', priority: 'high' },
    { id: 4, title: 'Follow-up Visit - Williams Family', type: 'followup', date: '2026-06-05', time: '3:00 PM', priority: 'low' },
    { id: 5, title: 'Medical Check-up - Child #148', type: 'medical', date: '2026-06-06', time: '11:00 AM', priority: 'high' },
    { id: 6, title: 'Parent Training Session', type: 'training', date: '2026-06-07', time: '1:00 PM', priority: 'medium' },
    { id: 7, title: 'Monthly Report Deadline', type: 'deadline', date: '2026-06-10', time: '5:00 PM', priority: 'high' },
  ];

  const liveNotifications = [
    { id: 1, message: 'New message from Sarah Williams', type: 'message', time: 'Just now', unread: true },
    { id: 2, message: 'Complaint #457 requires immediate attention', type: 'alert', time: '2 min ago', unread: true },
    { id: 3, message: 'Payment received - Application #2453', type: 'payment', time: '10 min ago', unread: true },
    { id: 4, message: 'System backup completed successfully', type: 'info', time: '30 min ago', unread: false },
    { id: 5, message: 'Document verification completed - Case #2401', type: 'success', time: '1 hour ago', unread: false },
  ];

  const chartData = [
    { month: 'Jan', applications: 45, adoptions: 12 },
    { month: 'Feb', applications: 52, adoptions: 15 },
    { month: 'Mar', applications: 48, adoptions: 18 },
    { month: 'Apr', applications: 61, adoptions: 14 },
    { month: 'May', applications: 55, adoptions: 20 },
    { month: 'Jun', applications: 27, adoptions: 8 },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'application': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'document': return <Upload className="w-5 h-5 text-orange-500" />;
      case 'approval': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'meeting': return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'bonding': return <Heart className="w-5 h-5 text-pink-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message': return 'bg-blue-100 border-blue-300';
      case 'alert': return 'bg-red-100 border-red-300';
      case 'payment': return 'bg-green-100 border-green-300';
      case 'success': return 'bg-emerald-100 border-emerald-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
              className={`bg-white rounded-lg shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${
                selectedCard === card.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.id)}
                className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs text-center font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  activity.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                  activity.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Notifications</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                  notification.unread ? 'font-medium' : ''
                }`}
              >
                <p className="text-sm text-gray-900">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">{notification.time}</p>
                  {notification.unread && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Calendar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(event.priority)}`}>
                    {event.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Applications & Adoptions Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line key="applications-line" type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
              <Line key="adoptions-line" type="monotone" dataKey="adoptions" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Adoptions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
