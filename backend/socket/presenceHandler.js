module.exports = (io, socket, onlineUsers) => {
  // Notify others that this user is online
  socket.broadcast.emit('user_online', { userId: socket.user.id });

  // If a client requests the online users list
  socket.on('get_online_users', (callback) => {
    if (typeof callback === 'function') {
      callback(Array.from(onlineUsers.keys()));
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.user.name}`);
    onlineUsers.delete(socket.user.id.toString());
    
    // Notify others that this user is offline
    socket.broadcast.emit('user_offline', { userId: socket.user.id });
  });
};
