const { createMessage, markAsRead } = require('../models/Message');

module.exports = (io, socket, onlineUsers) => {
  
  socket.on('send_message', async (data, callback) => {
    const { receiverId, content, type = 'direct' } = data;
    
    if (!receiverId || !content) {
      if (typeof callback === 'function') callback({ error: 'Missing parameters' });
      return;
    }

    try {
      // 1. Save to DB
      const message = await createMessage({
        senderId: socket.user.id,
        receiverId,
        content,
        type
      });

      // 2. Find receiver's socket
      const receiverSocketId = onlineUsers.get(receiverId.toString());

      // 3. Emit if online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
        io.to(receiverSocketId).emit('message_delivered', { messageId: message.id });
      }

      // Send ack to sender
      if (typeof callback === 'function') callback({ success: true, message });

    } catch (err) {
      console.error('[Socket] Error sending message:', err);
      if (typeof callback === 'function') callback({ error: 'Failed to send message' });
    }
  });

  socket.on('typing_start', ({ receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing_start', { senderId: socket.user.id });
    }
  });

  socket.on('typing_stop', ({ receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing_stop', { senderId: socket.user.id });
    }
  });

  socket.on('message_seen', async ({ messageId, senderId }) => {
    await markAsRead(messageId);
    
    // Notify sender that their message was read
    const senderSocketId = onlineUsers.get(senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit('message_seen', { messageId, readerId: socket.user.id });
    }
  });
};
