const { createNotification, markAsRead } = require('../models/Notification');

// This file serves two purposes:
// 1. Handling socket events from the client related to notifications
// 2. Exporting helpers to be used by standard Express REST routes

module.exports = (io, socket, onlineUsers) => {
  // Client requests to mark a notification as read
  socket.on('mark_notification_read', async ({ notificationId }, callback) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('DB markAsRead failed', err.message);
    }
    
    // Also update mock parent notifications
    if (global.mockParentNotifications) {
      const notif = global.mockParentNotifications.find(n => n.id == notificationId);
      if (notif) notif.is_read = true;
    }
    
    if (typeof callback === 'function') callback({ success: true });
  });
};

// --- Helpers for REST APIs or other internal backend modules ---

const sendNotificationToUser = async (io, onlineUsers, userId, title, message, type = 'system_alert') => {
  try {
    const notification = await createNotification({ userId, title, message, type });
    const userSocketId = onlineUsers.get(userId.toString());
    
    if (userSocketId) {
      io.to(userSocketId).emit('notification', notification);
    }
    return notification;
  } catch (err) {
    console.error('[Notification] Error sending to user:', err);
  }
};

const sendNotificationToRole = async (io, onlineUsers, role, title, message, type = 'announcement') => {
  // In a real app, you might want to bulk insert these to the DB first.
  // For now, we will just emit to the socket room representing the role
  io.to(`role_${role}`).emit('notification', { title, message, type, created_at: new Date() });
};

module.exports.sendNotificationToUser = sendNotificationToUser;
module.exports.sendNotificationToRole = sendNotificationToRole;
