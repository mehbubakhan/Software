import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import socketService from '../services/socketService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth() || {};
  const toastApi = useToast() || { info: () => {}, warning: () => {} };
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let currentSocket = null;
    const token = localStorage.getItem('token');

    if (user && token) {
      currentSocket = socketService.connect(token);
      setSocket(currentSocket);

      currentSocket.on('connect', () => {
        setIsConnected(true);
        currentSocket.emit('get_online_users', (users) => {
          setOnlineUsers(users);
        });
      });

      currentSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Presence handlers
      currentSocket.on('user_online', ({ userId }) => {
        setOnlineUsers(prev => [...new Set([...prev, userId.toString()])]);
      });

      currentSocket.on('user_offline', ({ userId }) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId.toString()));
      });

      // Global Notification Handler
      currentSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        toastApi.info(notification.title || 'New Notification');
      });

      currentSocket.on('announcement', (announcement) => {
        toastApi.warning(`Announcement from ${announcement.sender}: ${announcement.title}`);
      });
      
      // Fetch DB notifications for parents
      if (user.role === 'parent') {
        import('../services/api').then(({ default: api }) => {
          api.get('/notifications/parent').then(res => {
            if (res.data && res.data.ok) {
              setNotifications(prev => {
                const dbNotifs = res.data.data.map(n => ({
                  id: n.id,
                  title: n.title,
                  message: n.message,
                  is_read: n.is_read,
                  created_at: n.created_at,
                  source: 'db'
                }));
                // Merge without duplicates if any exist
                return [...prev, ...dbNotifs];
              });
            }
          }).catch(err => console.error("Error fetching notifications:", err));
        });
      }

    } else {
      socketService.disconnect();
      setSocket(null);
      setIsConnected(false);
    }

    return () => {
      if (currentSocket) {
        currentSocket.off('connect');
        currentSocket.off('disconnect');
        currentSocket.off('user_online');
        currentSocket.off('user_offline');
        currentSocket.off('notification');
        currentSocket.off('announcement');
      }
    };
  }, [user, toastApi]);

  const sendMessage = useCallback((receiverId, content, type = 'direct') => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject('Socket not connected');
      socket.emit('send_message', { receiverId, content, type }, (response) => {
        if (response.error) reject(response.error);
        else resolve(response.message);
      });
    });
  }, [socket]);

  const markNotificationRead = useCallback((notificationId, source) => {
    // Optimistically update the UI immediately
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));

    // Always try to hit the parent read endpoint (if it fails, no big deal)
    import('../services/api').then(({ default: api }) => {
      api.put(`/notifications/parent/${notificationId}/read`).catch(err => {
        // Silently fail if not a parent notification
      });
    });

    // Also notify via socket
    if (socket) {
      socket.emit('mark_notification_read', { notificationId }, () => {});
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    notifications,
    sendMessage,
    markNotificationRead
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
