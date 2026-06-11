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
  const { showToast } = useToast() || { showToast: () => {} };
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let currentSocket = null;

    if (user && user.token) {
      currentSocket = socketService.connect(user.token);
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
        showToast(notification.title || 'New Notification', 'info');
      });

      currentSocket.on('announcement', (announcement) => {
        showToast(`Announcement from ${announcement.sender}: ${announcement.title}`, 'warning');
      });
      
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
  }, [user, showToast]);

  const sendMessage = useCallback((receiverId, content, type = 'direct') => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject('Socket not connected');
      socket.emit('send_message', { receiverId, content, type }, (response) => {
        if (response.error) reject(response.error);
        else resolve(response.message);
      });
    });
  }, [socket]);

  const markNotificationRead = useCallback((notificationId) => {
    if (socket) {
      socket.emit('mark_notification_read', { notificationId }, (response) => {
        if (response.success) {
          setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
        }
      });
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
