const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { findById } = require('../models/User');

const setupPresence = require('./presenceHandler');
const setupMessaging = require('./messageHandler');
const setupRooms = require('./roomHandler');

const onlineUsers = new Map(); // userId -> socketId

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allows all origins (adjust for production)
      methods: ['GET', 'POST']
    }
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error: Missing token'));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await findById(payload.id);
      
      if (!user) return next(new Error('Authentication error: Invalid user'));

      // Attach user object to socket
      socket.user = {
        id: user.id,
        name: user.name,
        role: user.role
      };
      
      next();
    } catch (err) {
      next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.name} (${socket.user.role}) - ID: ${socket.id}`);

    // Map user to socket ID for tracking presence
    onlineUsers.set(socket.user.id.toString(), socket.id);

    setupPresence(io, socket, onlineUsers);
    setupMessaging(io, socket, onlineUsers);
    setupRooms(io, socket, onlineUsers);
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo, onlineUsers };
