
import { Building, FileText, Home, Bell, MessageSquare, User, Send, Paperclip, Mic } from "lucide-react";
import React, { useState } from "react";

// AgentMessages Component
const AgentMessages = () => {
  const [selectedChat, setSelectedChat] = useState('Clint');
  const [messageText, setMessageText] = useState('');
  
  const chats = [
    {
      id: 1,
      name: 'Clint',
      lastMessage: 'Can you share the price and basic info?',
      time: '11:52',
      unread: 0,
      avatar: null,
      isOnline: false
    },
    {
      id: 2,
      name: 'Tony',
      lastMessage: 'Thanks for the information',
      time: '10:58',
      unread: 2,
      avatar: null,
      isOnline: true
    },
    {
      id: 3,
      name: 'Steve',
      lastMessage: 'When can we schedule a visit?',
      time: '9:10',
      unread: 1,
      avatar: null,
      isOnline: true
    },
    {
      id: 4,
      name: 'Bruce',
      lastMessage: 'Perfect location!',
      time: '24 Oct 22',
      unread: 0,
      avatar: null,
      isOnline: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Clint',
      message: 'Can you share the price and basic info?',
      time: '11:49',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'Sure! The asking price is ₹3.5 lakhs. It is a BHK apartment with 2 bathrooms and a balcony located in a gated',
      time: '11:52',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Clint',
      message: 'Sounds good. Can I visit this weekend?',
      time: '11:53',
      isOwn: false
    },
    {
      id: 4,
      sender: 'You',
      message: 'Absolutely! Saturday at 10 AM works?',
      time: '11:55',
      isOwn: true
    },
    {
      id: 5,
      sender: 'Clint',
      message: 'Perfect. Please confirm the location.',
      time: '11:56',
      isOwn: false
    },
    {
      id: 6,
      sender: 'You',
      message: 'Sure! 154 New Townheights, Kalkatand Ive scheduled your visit. See you then!',
      time: '11:58',
      isOwn: true
    },
    {
      id: 7,
      sender: 'Clint',
      message: 'Thanks Michel. Looking forward to it!',
      time: '12:02',
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
        </div>
        
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.name)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChat === chat.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              
              {chat.unread > 0 && (
                <div className="ml-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{chat.unread}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{selectedChat}</h3>
              <p className="text-sm text-gray-500">Client</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Mic className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMessages