import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationCenter() {
  const { notifications, markNotificationRead, isConnected } = useSocket() || { notifications: [] };
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Filter out duplicate IDs if any exist
  const uniqueNotifications = Array.from(new Map(notifications.map(item => [item.id, item])).values())
    .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

  const unreadCount = uniqueNotifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) markNotificationRead(notif.id, notif.source);
    
    setIsOpen(false);
    
    if (notif.link) {
      navigate(notif.link);
      return;
    }

    const title = (notif.title || '').toLowerCase();
    const message = (notif.message || '').toLowerCase();
    const content = title + ' ' + message;
    const role = user?.role || 'parent';
    
    if (content.includes('child')) {
      if (role === 'admin') navigate('/dashboard/admin/child-monitoring');
      else if (role === 'nanny') navigate('/dashboard/nanny/children');
      else navigate('/dashboard/parent');
    } else if (content.includes('product')) {
      if (role === 'admin') navigate('/dashboard/admin/marketplace');
      else if (role === 'marketplace_seller') navigate('/dashboard/marketplace-seller');
      else navigate('/dashboard/parent/marketplace');
    } else if (content.includes('order')) {
      if (role === 'marketplace_seller') navigate('/dashboard/marketplace-seller/orders');
      else navigate('/dashboard/parent/marketplace');
    } else if (content.includes('nanny')) {
      if (role === 'admin') navigate('/dashboard/admin/nannies');
      else navigate('/dashboard/parent/hire-nanny');
    } else if (content.includes('daycare')) {
      if (role === 'admin') navigate('/dashboard/admin/daycares');
      else navigate('/dashboard/parent/daycare');
    } else if (content.includes('adoption')) {
      if (role === 'admin') navigate('/dashboard/admin/adoption');
      else navigate('/dashboard/parent/adoption');
    } else if (content.includes('message')) {
      navigate('/dashboard/messages');
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-slate-600 hover:text-slate-900 focus:outline-none transition-colors rounded-full hover:bg-slate-100"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-fuchsia-600 border-2 border-white rounded-full">
            {unreadCount}
          </span>
        )}
        {/* Connection status indicator */}
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-md">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {uniqueNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="text-4xl mb-2 block opacity-50">📭</span>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {uniqueNotifications.map(notif => (
                  <li 
                    key={notif.id} 
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-fuchsia-50/30' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-fuchsia-500' : 'bg-transparent'}`}></div>
                    <div>
                      <p className={`text-sm ${!notif.is_read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {new Date(notif.created_at || Date.now()).toLocaleTimeString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {uniqueNotifications.length > 0 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
