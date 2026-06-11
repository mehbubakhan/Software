module.exports = (io, socket, onlineUsers) => {
  
  // 1. Join a room
  socket.on('join_room', ({ room }) => {
    socket.join(room);
    console.log(`[Socket] User ${socket.user.name} joined room: ${room}`);
  });

  // 2. Leave a room
  socket.on('leave_room', ({ room }) => {
    socket.leave(room);
    console.log(`[Socket] User ${socket.user.name} left room: ${room}`);
  });

  // Automatically join a role-based room upon connection
  if (socket.user.role) {
    socket.join(`role_${socket.user.role}`);
  }

  // 3. Room messaging
  socket.on('room_message', ({ room, content }) => {
    // Note: You should save this to DB in a real app, maybe with type='room'
    io.to(room).emit('receive_room_message', {
      room,
      senderId: socket.user.id,
      senderName: socket.user.name,
      content,
      sent_at: new Date().toISOString()
    });
  });

  // 4. Admin Broadcasts
  socket.on('broadcast_all', ({ title, message }) => {
    if (socket.user.role !== 'admin') {
      return socket.emit('error', { message: 'Unauthorized: Admins only' });
    }
    socket.broadcast.emit('announcement', { title, message, sender: socket.user.name, sent_at: new Date() });
  });

  socket.on('broadcast_role', ({ role, title, message }) => {
    if (socket.user.role !== 'admin') {
      return socket.emit('error', { message: 'Unauthorized: Admins only' });
    }
    io.to(`role_${role}`).emit('announcement', { title, message, sender: socket.user.name, sent_at: new Date() });
  });

};
