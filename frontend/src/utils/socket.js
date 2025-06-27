import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3003';
const userSocketMap = {}; // Tracks userId to socketId mappings
let socket = null;

export const initializeSocket = (userId) => {
  // Prevent multiple initializations
  if (socket && socket.connected) {
    console.warn('Socket already initialized');
    return socket;
  }

  // Initialize new socket connection
  socket = io(SOCKET_URL, {
    withCredentials: true,
    query: { userId },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    transports: ['websocket', 'polling'] // Fallback transport
  });

  // Connection handlers
  socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
    // Update user mapping on connection
    userSocketMap[userId] = socket.id;
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
    // Attempt reconnection automatically (handled by socket.io)
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // The disconnection was initiated by the server, need to manually reconnect
      socket.connect();
    }
    // Clean up user mapping
    delete userSocketMap[userId];
  });

  socket.on('reconnect_attempt', (attempt) => {
    console.log(`Reconnection attempt ${attempt}`);
  });

  socket.on('reconnect_failed', () => {
    console.error('Reconnection failed');
  });

  // Handle custom 'userConnected' event from server
  socket.on('userConnected', ({ userId, socketId }) => {
    userSocketMap[userId] = socketId;
  });

  // Handle custom 'userDisconnected' event from server
  socket.on('userDisconnected', (userId) => {
    delete userSocketMap[userId];
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket() first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    // Clean up all listeners to prevent memory leaks
    socket.off('connect');
    socket.off('connect_error');
    socket.off('disconnect');
    socket.off('reconnect_attempt');
    socket.off('reconnect_failed');
    socket.off('userConnected');
    socket.off('userDisconnected');
    
    socket.disconnect();
    socket = null;
    
    // Clear user mappings
    Object.keys(userSocketMap).forEach(userId => {
      delete userSocketMap[userId];
    });
  }
};

export const getReceiverSocketId = (receiverId) => {
  if (!receiverId) {
    console.warn('No receiverId provided');
    return null;
  }
  return userSocketMap[receiverId] || null;
};

// Additional utility functions
export const isSocketConnected = () => {
  return socket && socket.connected;
};

export const joinConversationRoom = (conversationId) => {
  if (socket) {
    socket.emit('joinConversation', conversationId);
  } else {
    console.warn('Cannot join room - socket not initialized');
  }
};

export const leaveConversationRoom = (conversationId) => {
  if (socket) {
    socket.emit('leaveConversation', conversationId);
  }
};

// Message sending helper
export const sendSocketMessage = (event, data) => {
  if (!socket) {
    console.error('Socket not initialized');
    return false;
  }
  
  if (!event || !data) {
    console.error('Event and data are required');
    return false;
  }
  
  socket.emit(event, data);
  return true;
};

// Add these new functions to your frontend socket utils
export const sendTypingIndicator = (conversationId, userId, isTyping) => {
  if (!socket) return false;
  socket.emit('typing', { conversationId, userId, isTyping });
  return true;
};

export const joinAgentChannel = (agentId) => {
  if (socket) {
    socket.emit('joinAgentChannel', agentId);
  }
};

export const listenForAgentStatus = (callback) => {
  if (!socket) return;
  
  const handler = ({ agentId, isOnline }) => {
    callback(agentId, isOnline);
  };
  
  socket.on('agentStatus', handler);
  
  // Return cleanup function
  return () => {
    socket.off('agentStatus', handler);
  };
};

export const listenForTyping = (callback) => {
  if (!socket) return;
  
  const handler = ({ conversationId, userId, isTyping }) => {
    callback(conversationId, userId, isTyping);
  };
  
  socket.on('typing', handler);
  
  // Return cleanup function
  return () => {
    socket.off('typing', handler);
  };
};