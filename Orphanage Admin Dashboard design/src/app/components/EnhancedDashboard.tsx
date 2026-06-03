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
  Eye,
  Upload,
  Send,
  Clock,
  MessageCircle,
  Heart,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Bell
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EnhancedDashboardProps {
  onQuickAction: (action: string) => void;
  onNavigate: (section: string) => void;
}

export default function EnhancedDashboard({ onQuickAction, onNavigate }: EnhancedDashboardProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const summaryCards = [
    { id: 'total-children', label: 'Total Children', value: 148, icon: Users, color: 'bg-blue-500', change: '+5', trend: 'up', action: 'children' },
    { id: 'available', label: 'Available for Adoption', value: 43, icon: Heart, color: 'bg-green-500', change: '-3', trend: 'down', action: 'children' },
    { id: 'pending-apps', label: 'Pending Applications', value: 27, icon: FileText, color: 'bg-yellow-500', change: '+8', trend: 'up', action: 'applications' },
    { id: 'approved-apps', label: 'Approved Applications', value: 64, icon: CheckCircle, color: 'bg-emerald-500', change: '+12', trend: 'up', action: 'applications' },
    { id: 'upcoming-meetings', label: 'Upcoming Meetings', value: 18, icon: Calendar, color: 'bg-purple-500', change: '+4', trend: 'up', action: 'meetings' },
    { id: 'complaints', label: 'Active Complaints', value: 3, icon: AlertCircle, color: 'bg-pink-500', change: '-2', trend: 'down', action: 'complaints' },
  ];

  const quickActions = [
    { id: 'add-child', label: 'Add Child', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'review-applications', label: 'Review Applications', icon: Eye, color: 'bg-green-600 hover:bg-green-700', navigate: 'applications' },
    { id: 'schedule-meeting', label: 'Schedule Meeting', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'upload-report', label: 'Upload Report', icon: Upload, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { id: 'view-complaints', label: 'View Complaints', icon: AlertCircle, color: 'bg-orange-600 hover:bg-orange-700', navigate: 'complaints' },
    { id: 'send-notification', label: 'Send Notification', icon: Send, color: 'bg-pink-600 hover:bg-pink-700' },
  ];

  const recentActivities = [
    { id: 1, type: 'application', message: 'New parent application from John & Mary Smith', time: '5 minutes ago', status: 'new', icon: FileText },
    { id: 2, type: 'document', message: 'Medical certificate uploaded for Emma Johnson', time: '15 minutes ago', status: 'pending', icon: Upload },
    { id: 3, type: 'counselling', message: 'Upcoming counselling session with Dr. Sarah - Case #2453', time: '1 hour ago', status: 'scheduled', icon: MessageCircle },
    { id: 4, type: 'document', message: 'Education report uploaded - Child ID: CH045', time: '2 hours ago', status: 'completed', icon: FileCheck },
    { id: 5, type: 'complaint', message: 'Complaint #458 - Facilities maintenance issue reported', time: '3 hours ago', status: 'alert', icon: AlertCircle },
    { id: 6, type: 'application', message: 'Application #2456 approved - Williams family', time: '4 hours ago', status: 'approved', icon: CheckCircle },
  ];

  const notifications = [
    { id: 1, message: 'Meeting reminder: Home visit with Smith family tomorrow 10:00 AM', type: 'meeting', time: '2 min ago', unread: true, icon: Calendar },
    { id: 2, message: 'Document verification required for Application #2458', type: 'alert', time: '15 min ago', unread: true, icon: ShieldCheck },
    { id: 3, message: 'Admin announcement: Monthly training session scheduled for June 10', type: 'info', time: '1 hour ago', unread: true, icon: Bell },
    { id: 4, message: 'Medical checkup completed for Child #CH042', type: 'success', time: '2 hours ago', unread: false, icon: CheckCircle },
    { id: 5, message: 'New complaint filed - Case #459', type: 'alert', time: '3 hours ago', unread: false, icon: AlertCircle },
  ];

  const chartData = [
    { month: 'Jan', applications: 45, adoptions: 12, children: 142 },
    { month: 'Feb', applications: 52, adoptions: 15, children: 145 },
    { month: 'Mar', applications: 48, adoptions: 18, children: 143 },
    { month: 'Apr', applications: 61, adoptions: 14, children: 146 },
    { month: 'May', applications: 55, adoptions: 20, children: 147 },
    { month: 'Jun', applications: 27, adoptions: 8, children: 148 },
  ];

  const adoptionStatusData = [
    { name: 'Ready', value: 43, color: '#10b981' },
    { name: 'In Process', value: 27, color: '#f59e0b' },
    { name: 'Trial Period', value: 15, color: '#3b82f6' },
    { name: 'Completed', value: 63, color: '#8b5cf6' },
  ];

  const handleCardClick = (card: any) => {
    setSelectedCard(card.id === selectedCard ? null : card.id);
    if (card.action) {
      onNavigate(card.action);
    }
  };

  const handleQuickActionClick = (action: any) => {
    if (action.navigate) {
      onNavigate(action.navigate);
    } else {
      onQuickAction(action.id);
    }
  };

  const getActivityIcon = (activity: any) => {
    const Icon = activity.icon;
    const colorMap: any = {
      application: 'text-blue-500',
      document: 'text-orange-500',
      counselling: 'text-purple-500',
      complaint: 'text-red-500',
      approval: 'text-green-500'
    };
    return <Icon className={`w-5 h-5 ${colorMap[activity.type] || 'text-gray-500'}`} />;
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-purple-100 border-purple-300';
      case 'alert': return 'bg-red-100 border-red-300';
      case 'success': return 'bg-green-100 border-green-300';
      default: return 'bg-blue-100 border-blue-300';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
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

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action)}
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
        {/* Recent Activities Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="mt-0.5">{getActivityIcon(activity)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  activity.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                  activity.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  activity.status === 'alert' ? 'bg-red-100 text-red-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Widget */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {notifications.filter(n => n.unread).length}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                    notification.unread ? 'font-medium' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">{notification.time}</p>
                        {notification.unread && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Applications & Adoptions Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line key="line-applications" type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Applications" />
              <Line key="line-adoptions" type="monotone" dataKey="adoptions" stroke="#10b981" strokeWidth={2} name="Adoptions" />
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Adoption Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adoptionStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {adoptionStatusData.map((entry) => (
                  <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {adoptionStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
