let io = null;

class SocketService {
  initialize(server) {
    const { Server } = require('socket.io');
    const { env } = require('../config/env');
    
    io = new Server(server, {
      cors: {
        origin: env.clientUrl || 'http://localhost:3000',
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join user room
      socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join conversation room
      socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
      });

      // Leave conversation room
      socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  }

  getIO() {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }

  // Emit to specific user
  emitToUser(userId, event, data) {
    if (io) {
      io.to(`user:${userId}`).emit(event, data);
    }
  }

  // Emit to conversation
  emitToConversation(conversationId, event, data) {
    if (io) {
      io.to(`conversation:${conversationId}`).emit(event, data);
    }
  }

  // Emit to all connected clients
  emitToAll(event, data) {
    if (io) {
      io.emit(event, data);
    }
  }
}

module.exports = new SocketService();
