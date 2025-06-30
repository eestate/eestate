import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Paperclip } from 'lucide-react';
import { initializeSocket } from '@/utils/socket';
import { useGetChatsQuery, useGetMessagesQuery, useSendMessageMutation, useSendTextMessageMutation } from '@/redux/services/ChatApi';

const AgentMessages = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  const {
    data: chats = [],
    isLoading: chatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useGetChatsQuery(undefined, { skip: !userId });

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetMessagesQuery(selectedChat?.chatId, { skip: !selectedChat?.chatId });

  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [sendTextMessage, { isLoading: sendingTextMessage }] = useSendTextMessageMutation();

  // Initialize socket connection
useEffect(() => {
  if (userId && !socketRef.current) {
    try {
      socketRef.current = initializeSocket(userId);
      
      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Try to reconnect
          socketRef.current.connect();
        }
      });

      console.log('Socket initialized with userId:', userId);
    } catch (err) {
      console.error('Socket initialization error:', err);
      setError('Failed to connect to chat server');
    }
  }

  return () => {
    if (socketRef.current) {
      socketRef.current.off('disconnect');
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log('Socket disconnected');
    }
  };
}, [userId]);

  // Socket connection handlers
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleConnect = () => {
      console.log('Connected to Socket.IO server with userId:', userId);
      setError(null);
    };

    const handleConnectError = (err) => {
      console.error('Socket.IO connection error:', err.message);
      setError('Failed to connect to chat server. Please try again.');
    };

    const handleOnlineUsers = (onlineUserIds) => {
      console.log('Online users:', onlineUserIds);
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('onlineUsers', handleOnlineUsers);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [userId]);

  // Conversation message handlers
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedChat?.chatId) return;

    socket.emit('joinConversation', selectedChat.chatId);
    console.log('Joined conversation room:', selectedChat.chatId);

    const handleNewMessage = (data) => {
      console.log('Received newMessage:', data);
      if (data.conversationId.toString() === selectedChat.chatId.toString()) {
        refetchMessages();
      }
      refetchChats();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveConversation', selectedChat.chatId);
      console.log('Left conversation room:', selectedChat.chatId);
    };
  }, [selectedChat, refetchMessages, refetchChats]);

  // Chat list update handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleUpdateChatList = () => {
      refetchChats();
    };

    socket.on('updateChatList', handleUpdateChatList);

    return () => {
      socket.off('updateChatList', handleUpdateChatList);
    };
  }, [refetchChats]);

  // Mark messages as read when chat is selected
  useEffect(() => {
    const socket = socketRef.current;
    if (selectedChat?.chatId && socket) {
      socket.emit('markAsRead', { conversationId: selectedChat.chatId });
      refetchChats();
    }
  }, [selectedChat?.chatId, refetchChats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Error handling
  useEffect(() => {
    if (chatsError) {
      console.error('Error fetching chats:', chatsError);
      setError('Failed to load chats');
    }
    if (messagesError) {
      console.error('Error loading messages:', messagesError);
      setError('Failed to load messages');
    }
  }, [chatsError, messagesError]);

const handleSendMessage = async () => {
  if (!messageText.trim() && !imageFile) return;
  
  // Get current socket reference
  const socket = socketRef.current;
  if (!selectedChat?.chatId || !socket) {
    setError('Chat not initialized. Please try again.');
    return;
  }

  try {
    if (messageText.trim() && !imageFile) {
      await sendTextMessage({
        conversationId: selectedChat.chatId,
        text: messageText,
      }).unwrap();
    } else {
      const formData = new FormData();
      if (messageText.trim()) formData.append('text', messageText);
      if (imageFile) formData.append('image', imageFile);

      await sendMessage({
        conversationId: selectedChat.chatId,
        body: formData,
      }).unwrap();
    }

    // Check socket connection before emitting
    if (socket.connected) {
      socket.emit('newMessage', {
        conversationId: selectedChat.chatId,
        senderId: userId,
      });
    } else {
      console.warn('Socket not connected, message emitted but socket not notified');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    setError(`Failed to send message: ${error.message || 'Unknown error'}`);
  } finally {
    setMessageText('');
    setImageFile(null);
  }
};

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

const MessageItem = React.memo(({ message, isOwn }) => {
  // Safely handle message data
  const text = message?.text || '';
  const image = message?.image;
  const createdAt = message?.createdAt ? new Date(message.createdAt) : new Date();

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`font-manrope max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
      >
        {text && <p className="font-manrope text-sm">{text}</p>}
        {image && (
          <img
            src={image}
            alt="Chat image"
            className="max-w-full h-auto rounded-lg mt-2"
          />
        )}
        <p className={`font-manrope text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
});

  if (!userId) {
    return <div className="text-center text-red-500">Please log in to access the chat.</div>;
  }

  

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50">
      {/* Chat list sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
        </div>
        {error && <p className="text-red-500 p-4">{error}</p>}
        {chatsLoading && <p className="text-gray-500 p-4">Loading chats...</p>}
        {!chatsLoading && chats.length === 0 && !error && (
          <p className="text-gray-500 p-4">No chats available.</p>
        )}
        <div className="overflow-y-auto">
          {chats.map((chat) => {
            const unreadCount = chat.unreadCount?.[userId] || 0;
            return (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat({
                    chatId: chat._id.toString(),
                    name: chat.name,
                    profilePic: chat.profilePic,
                    property: chat.property ? { id: chat.property.id?.toString() || chat.property } : null,
                  });
                  if (unreadCount > 0 && socketRef.current) {
                    socketRef.current.emit('markAsRead', { conversationId: chat._id });
                  }
                }}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedChat?.chatId === chat._id.toString() ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {chat.profilePic ? (
                      <img src={chat.profilePic} alt={chat.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-manrope font-medium text-gray-900">{chat.name}</h3>
                    <span className="font-manrope text-xs text-gray-500">
                      {chat.lastMessage?.createdAt &&
                        new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="ml-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {unreadCount > "" ? '' : unreadCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {selectedChat.profilePic ? (
                    <img src={selectedChat.profilePic} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-manrope font-medium text-gray-900">{selectedChat.name}</h3>
                  {/* <p className="font-manrope text-sm text-gray-500">Client</p> */}
                </div>
              </div>
            </div>
<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
  {messagesLoading ? (
      <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
    ))}
  </div>
  ) : messagesError ? (
    <p className="font-manrope text-red-500 text-center">Error loading messages</p>
  ) : messages.length === 0 ? (
    <p className="font-manrope text-gray-500 text-center">No messages yet</p>
  ) : (
    messages.map((message) => {
      // Add null checks for message and its properties
      if (!message?._id || !message?.senderId?._id) {
        console.warn('Invalid message format:', message);
        return null; // Skip rendering invalid messages
      }
      
      return (
        <MessageItem
          key={message._id}
          message={message}
          isOwn={message.senderId._id.toString() === userId}
        />
      );
    })
  )}
  <div ref={chatEndRef} />
</div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-manrope text-gray-500">Select a chat to start messaging</p>
          </div>
        )}

        {/* Message input */}
        {selectedChat && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              {/* <label htmlFor="image-upload" className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <Paperclip className="w-5 h-5" />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label> */}
              <div className="font-manrope flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sendingMessage || sendingTextMessage}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={(!messageText.trim() && !imageFile) || sendingMessage || sendingTextMessage}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentMessages;