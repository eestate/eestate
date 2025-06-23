import { Server } from 'socket.io';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const userSocketMap = {};
let ioInstance = null;

export function initializeSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 120000,
      skipMiddlewares: true,
    },
  });

  console.log('🔌 Socket.IO initializing');

  ioInstance.on('connection', (socket) => {
    console.log('✅ New connection:', socket.id);

    const userId = socket.handshake.query.userId;
    if (!userId || userId === 'undefined') {
      console.warn('❗ Connection rejected - missing or invalid userId');
      socket.disconnect(true);
      return;
    }

    // Handle multiple connections for the same user
    if (userSocketMap[userId] && userSocketMap[userId] !== socket.id) {
      console.log(`♻️ Displacing previous connection for user ${userId}`);
      ioInstance.sockets.sockets.get(userSocketMap[userId])?.disconnect(true);
    }

    userSocketMap[userId] = socket.id;
    console.log('Updated userSocketMap:', userSocketMap);
    ioInstance.emit('onlineUsers', Object.keys(userSocketMap));

    // Join conversation room
    socket.on('joinConversation', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error('Conversation not found:', conversationId);
          return;
        }
        if (!conversation.participants.includes(userId)) {
          console.error('User not in conversation:', userId, conversationId);
          return;
        }
        socket.join(`conversation:${conversationId}`);
        console.log(`User ${userId} joined conversation:${conversationId}`);
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    });

    // Leave conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation:${conversationId}`);
    });

    // Join property-specific room
    socket.on('joinPropertyRoom', (propertyId) => {
      socket.join(`property_${propertyId}`);
      console.log(`🏠 User ${userId} joined property room ${propertyId}`);
    });

    // Handle new message
    socket.on('newMessage', async ({ conversationId, senderId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error('Conversation not found:', conversationId);
          return;
        }
        if (!conversation.participants.includes(senderId)) {
          console.error('Sender not in conversation:', senderId, conversationId);
          return;
        }
        console.log('New message received:', { conversationId, senderId });
        ioInstance.to(`conversation:${conversationId}`).emit('newMessage', { conversationId, senderId });
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    });

    // Mark messages as read
    socket.on('markAsRead', async ({ conversationId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error('Conversation not found:', conversationId);
          return;
        }
        if (!conversation.participants.includes(userId)) {
          console.error('User not in conversation:', userId, conversationId);
          return;
        }
        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { [`unreadCount.${userId}`]: 0 },
        });
        console.log(`Messages marked as read for user ${userId} in conversation ${conversationId}`);
        ioInstance.emit('updateChatList');
      } catch (error) {
        console.error('Read receipt error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ Disconnected:', socket.id);
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        console.log('Updated userSocketMap:', userSocketMap);
        ioInstance.emit('onlineUsers', Object.keys(userSocketMap));
      }
    });
  });

  return ioInstance;
}

export function getSocketId(userId) {
  const socketId = userSocketMap[userId];
  console.log('Retrieving socket ID for user:', { userId, socketId });
  return socketId;
}

export function getOnlineUsers() {
  return Object.keys(userSocketMap);
}

export function getReceiverSocketId(userId) {
  const socketId = userSocketMap[userId];
  console.log('Retrieving socket ID for receiver:', { userId, socketId });
  return socketId;
}

export function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized! Call initializeSocket() first');
  }
  return ioInstance;
}