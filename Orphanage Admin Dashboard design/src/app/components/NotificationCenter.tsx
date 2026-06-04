import { useState } from 'react';
import {
  Bell,
  FileText,
  Calendar,
  AlertTriangle,
  DollarSign,
  Shield,
  Upload,
  Check,
  Trash2,
  Eye,
  Filter,
  CheckCheck,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'Application' | 'Meeting' | 'Complaint' | 'Payment' | 'Admin Warning' | 'Document Update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedId?: string;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'NOT-001',
      type: 'Application',
      title: 'New Adoption Application',
      message: 'John & Mary Smith have submitted a new adoption application (APP-2024-015)',
      timestamp: '2026-06-03 14:30',
      read: false,
      priority: 'high',
      relatedId: 'APP-2024-015'
    },
    {
      id: 'NOT-002',
      type: 'Meeting',
      title: 'Meeting Reminder',
      message: 'Upcoming counselling session with Williams family tomorrow at 10:00 AM',
      timestamp: '2026-06-03 14:15',
      read: false,
      priority: 'medium',
      relatedId: 'MEET-2024-042'
    },
    {
      id: 'NOT-003',
      type: 'Complaint',
      title: 'New Complaint Filed',
      message: 'Urgent complaint regarding child safety concern (COMP-007)',
      timestamp: '2026-06-03 13:45',
      read: false,
      priority: 'urgent',
      relatedId: 'COMP-007'
    },
    {
      id: 'NOT-004',
      type: 'Document Update',
      title: 'Document Verified',
      message: 'Medical certificate for Child #CH045 has been verified and approved',
      timestamp: '2026-06-03 12:30',
      read: true,
      priority: 'low',
      relatedId: 'DOC-002'
    },
    {
      id: 'NOT-005',
      type: 'Payment',
      title: 'Payment Received',
      message: 'Application fee payment of $500 received from Chen family',
      timestamp: '2026-06-03 11:20',
      read: true,
      priority: 'medium',
      relatedId: 'PAY-2024-123'
    },
    {
      id: 'NOT-006',
      type: 'Admin Warning',
      title: 'System Maintenance Scheduled',
      message: 'System will be under maintenance on June 5, 2026 from 2:00 AM to 4:00 AM',
      timestamp: '2026-06-03 10:00',
      read: false,
      priority: 'high'
    },
    {
      id: 'NOT-007',
      type: 'Application',
      title: 'Application Status Update',
      message: 'Application APP-2024-012 has been moved to final review stage',
      timestamp: '2026-06-03 09:30',
      read: true,
      priority: 'medium',
      relatedId: 'APP-2024-012'
    },
    {
      id: 'NOT-008',
      type: 'Meeting',
      title: 'Meeting Cancelled',
      message: 'Trial bonding session with Smith family has been rescheduled to June 10',
      timestamp: '2026-06-02 16:45',
      read: true,
      priority: 'medium',
      relatedId: 'MEET-2024-038'
    },
    {
      id: 'NOT-009',
      type: 'Document Update',
      title: 'Document Pending Review',
      message: 'Income certificate uploaded for APP-2024-010 requires verification',
      timestamp: '2026-06-02 14:20',
      read: false,
      priority: 'medium',
      relatedId: 'DOC-003'
    },
    {
      id: 'NOT-010',
      type: 'Admin Warning',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from IP 192.168.1.250',
      timestamp: '2026-06-02 11:15',
      read: false,
      priority: 'urgent'
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const notificationTypes = ['All', 'Application', 'Meeting', 'Complaint', 'Payment', 'Admin Warning', 'Document Update'];

  const statistics = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    urgent: notifications.filter(n => n.priority === 'urgent').length,
    today: notifications.filter(n => n.timestamp.startsWith('2026-06-03')).length
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = selectedFilter === 'All' || notification.type === selectedFilter;
    const matchesRead = !showUnreadOnly || !notification.read;
    return matchesType && matchesRead;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
      toast.success('All notifications deleted');
    }
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Application': return FileText;
      case 'Meeting': return Calendar;
      case 'Complaint': return AlertTriangle;
      case 'Payment': return DollarSign;
      case 'Admin Warning': return Shield;
      case 'Document Update': return Upload;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Application': return 'bg-blue-100 text-blue-700';
      case 'Meeting': return 'bg-purple-100 text-purple-700';
      case 'Complaint': return 'bg-red-100 text-red-700';
      case 'Payment': return 'bg-green-100 text-green-700';
      case 'Admin Warning': return 'bg-yellow-100 text-yellow-700';
      case 'Document Update': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-red-500 bg-red-50';
      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return 'border-l-4 border-gray-300 bg-white';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
        <p className="text-gray-600 mt-1">View all alerts and updates</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.total}</h3>
          <p className="text-sm text-gray-600">Total Notifications</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.unread}</h3>
          <p className="text-sm text-gray-600">Unread</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.urgent}</h3>
          <p className="text-sm text-gray-600">Urgent</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.today}</h3>
          <p className="text-sm text-gray-600">Today</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {notificationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Show unread only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => {
            const Icon = getTypeIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => handleViewDetails(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {notification.timestamp}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">{notification.message}</p>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.priority === 'urgent' ? 'bg-red-600 text-white' :
                        notification.priority === 'high' ? 'bg-orange-600 text-white' :
                        notification.priority === 'medium' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {notification.priority.toUpperCase()}
                      </span>
                      {notification.relatedId && (
                        <span className="text-xs text-blue-600 font-medium">
                          {notification.relatedId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications found</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Notification Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedNotification(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = getTypeIcon(selectedNotification.type);
                  return (
                    <div className={`p-3 rounded-lg ${getTypeColor(selectedNotification.type)}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedNotification.title}</h3>
                  <p className="text-sm text-gray-500">{selectedNotification.timestamp}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{selectedNotification.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-gray-900">{selectedNotification.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <p className="text-gray-900 capitalize">{selectedNotification.priority}</p>
                </div>
                {selectedNotification.relatedId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Related ID</label>
                    <p className="text-blue-600 font-medium">{selectedNotification.relatedId}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className={selectedNotification.read ? 'text-gray-600' : 'text-blue-600 font-medium'}>
                    {selectedNotification.read ? 'Read' : 'Unread'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleDelete(selectedNotification.id);
                  setShowDetailsModal(false);
                  setSelectedNotification(null);
                }}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedNotification(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
