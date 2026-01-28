const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const logger = require('../utils/logger');

module.exports = (socket, io) => {
  /**
   * Join conversation room
   */
  socket.on('chat:join', async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        socket.emit('chat:error', { message: 'Conversation not found' });
        return;
      }

      // Check if user is participant
      if (!conversation.participants.includes(socket.userId)) {
        socket.emit('chat:error', { message: 'Not authorized' });
        return;
      }

      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${socket.userId} joined conversation ${conversationId}`);

      socket.emit('chat:joined', { conversationId });
    } catch (error) {
      logger.error('Error joining conversation:', error);
      socket.emit('chat:error', { message: 'Failed to join conversation' });
    }
  });

  /**
   * Leave conversation room
   */
  socket.on('chat:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    logger.info(`User ${socket.userId} left conversation ${conversationId}`);
  });

  /**
   * Send message
   */
  socket.on('chat:message', async (data) => {
    try {
      const { conversationId, content, attachments } = data;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        socket.emit('chat:error', { message: 'Conversation not found' });
        return;
      }

      // Check authorization
      if (!conversation.participants.includes(socket.userId)) {
        socket.emit('chat:error', { message: 'Not authorized' });
        return;
      }

      // Create message
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        content,
        attachments: attachments || []
      });

      // Populate sender info
      await message.populate('sender', 'name profilePicture');

      // Update conversation
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      // Emit to all participants in the conversation
      io.to(`conversation:${conversationId}`).emit('chat:message', {
        message: message.toObject(),
        conversationId
      });

      // Send push notification to other participants
      const otherParticipants = conversation.participants.filter(
        p => p.toString() !== socket.userId.toString()
      );

      for (const participantId of otherParticipants) {
        io.to(`user:${participantId}`).emit('notification', {
          type: 'new_message',
          title: 'New Message',
          message: `${message.sender.name}: ${content.substring(0, 50)}...`,
          data: { conversationId, messageId: message._id }
        });
      }

      logger.info(`Message sent in conversation ${conversationId}`);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('chat:error', { message: 'Failed to send message' });
    }
  });

  /**
   * Mark messages as read
   */
  socket.on('chat:read', async (data) => {
    try {
      const { conversationId, messageIds } = data;

      await Message.updateMany(
        {
          _id: { $in: messageIds },
          conversation: conversationId,
          sender: { $ne: socket.userId }
        },
        {
          read: true,
          readAt: new Date()
        }
      );

      // Notify other participants
      socket.to(`conversation:${conversationId}`).emit('chat:read', {
        conversationId,
        messageIds,
        readBy: socket.userId
      });

      logger.info(`Messages marked as read in conversation ${conversationId}`);
    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  });

  /**
   * Typing indicator
   */
  socket.on('chat:typing', (data) => {
    const { conversationId, isTyping } = data;

    socket.to(`conversation:${conversationId}`).emit('chat:typing', {
      conversationId,
      userId: socket.userId,
      isTyping
    });
  });

  /**
   * Get conversation messages
   */
  socket.on('chat:getMessages', async (data) => {
    try {
      const { conversationId, page = 1, limit = 50 } = data;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation || !conversation.participants.includes(socket.userId)) {
        socket.emit('chat:error', { message: 'Not authorized' });
        return;
      }

      const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'name profilePicture')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Message.countDocuments({ conversation: conversationId });

      socket.emit('chat:messages', {
        conversationId,
        messages: messages.reverse(),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error getting messages:', error);
      socket.emit('chat:error', { message: 'Failed to load messages' });
    }
  });

  /**
   * Get conversations list
   */
  socket.on('chat:getConversations', async (data) => {
    try {
      const { page = 1, limit = 20 } = data;

      const conversations = await Conversation.find({
        participants: socket.userId
      })
        .populate('participants', 'name profilePicture')
        .populate('lastMessage')
        .sort({ lastMessageAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Conversation.countDocuments({
        participants: socket.userId
      });

      socket.emit('chat:conversations', {
        conversations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error getting conversations:', error);
      socket.emit('chat:error', { message: 'Failed to load conversations' });
    }
  });

  /**
   * Create or get conversation
   */
  socket.on('chat:createConversation', async (data) => {
    try {
      const { participantId } = data;

      // Check if conversation already exists
      let conversation = await Conversation.findOne({
        participants: { $all: [socket.userId, participantId] }
      }).populate('participants', 'name profilePicture');

      if (!conversation) {
        // Create new conversation
        conversation = await Conversation.create({
          participants: [socket.userId, participantId]
        });

        await conversation.populate('participants', 'name profilePicture');

        logger.info(`New conversation created between ${socket.userId} and ${participantId}`);
      }

      socket.emit('chat:conversationCreated', { conversation });
    } catch (error) {
      logger.error('Error creating conversation:', error);
      socket.emit('chat:error', { message: 'Failed to create conversation' });
    }
  });
};
