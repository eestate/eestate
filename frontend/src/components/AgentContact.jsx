

// import React, { useState, useEffect, useRef } from 'react';
// import { UserIcon, MailIcon, PhoneIcon, MessageSquareIcon, CalendarIcon, ClockIcon, XIcon } from 'lucide-react';
// import io from 'socket.io-client';
// import { useCreateBookingMutation } from '@/redux/services/BookingApi';
// import { useGetMessagesQuery } from '@/redux/services/ChatApi';

// const socket = io('http://localhost:3003');

// const AgentContact = ({ agent, propertyId }) => {
//   // Get user data from localStorage and parse it
//   const userData = JSON.parse(localStorage.getItem('user'));
//   const userId = userData?._id;

//   const [formData, setFormData] = useState({
//     name: userData?.name || '',
//     email: userData?.email || '',
//     phone: userData?.phone || '',
//     message: "I'm Interested In this property...",
//     date: '',
//     time: '',
//   });

//   const [showChat, setShowChat] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const chatEndRef = useRef(null);

//   // Ensure chatId is properly formatted
//   const chatId = userId && agent?._id ? `${userId}-${agent._id}` : null;
  
//   const { data: fetchedMessages, isLoading: messagesLoading } = useGetMessagesQuery(chatId, { skip: !showChat || !chatId });
//   const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();

//   useEffect(() => {
//     if (showChat && fetchedMessages) {
//       setMessages(fetchedMessages);
//     }
//   }, [fetchedMessages, showChat]);

//   useEffect(() => {
//     if (showChat && chatId) {
//       socket.emit('joinChat', chatId);
//       socket.on('receiveMessage', (message) => {
//         setMessages((prev) => [...prev, message]);
//       });
//       return () => {
//         socket.off('receiveMessage');
//         socket.emit('leaveChat', chatId);
//       };
//     }
//   }, [showChat, chatId]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!userId) {
//       alert('Please log in to schedule a visit');
//       return;
//     }

//     try {
//       const response = await createBooking({
//         userId,
//         agentId: agent._id,
//         propertyId,
//         ...formData,
//         date: new Date(formData.date),
//       }).unwrap();
      
//       alert('Visit scheduled successfully!');
//       setFormData(prev => ({
//         ...prev,
//         date: '',
//         time: '',
//       }));
//     } catch (error) {
//       console.error('Booking error:', error);
//       alert(error?.data?.message || 'Error scheduling visit');
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() && userId) {
//       const message = {
//         chatId,
//         senderId: userId,
//         receiverId: agent._id,
//         text: newMessage,
//         timestamp: new Date().toISOString(),
//       };
//       socket.emit('sendMessage', message);
//       setNewMessage('');
//     }
//   };

//   if (!userId) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <p className="text-red-500 text-center py-4">
//           You must be logged in to contact the agent.
//         </p>
//       </div>
//     );
//   }

//   if (!agent) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <p className="text-gray-500 text-center py-4">
//           Agent information not available.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//       {/* Agent Info Section */}
//       <div className="flex items-center mb-6">
//         <img
//           src={agent.profilePic || 'https://via.placeholder.com/150'}
//           alt={agent.name}
//           className="w-16 h-16 rounded-full object-cover mr-4"
//         />
//         <div>
//           <h3 className="text-xl font-semibold">{agent.name}</h3>
//           <p className="text-gray-600">Property Agent</p>
//         </div>
//       </div>

//       {/* Contact Info */}
//       <div className="mb-6">
//         <div className="flex items-center mb-2">
//           <PhoneIcon size={16} className="mr-2 text-gray-600" />
//           <span>{agent.phone || 'Not provided'}</span>
//         </div>
//         <div className="flex items-center">
//           <MailIcon size={16} className="mr-2 text-gray-600" />
//           <span>{agent.email}</span>
//         </div>
//       </div>

//       {/* Toggle Button */}
//       <div className="mb-6">
//         <button
//           onClick={() => setShowChat(!showChat)}
//           className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center items-center hover:bg-blue-700 transition-colors"
//         >
//           <MessageSquareIcon size={16} className="mr-2" />
//           {showChat ? 'Show Schedule Form' : 'Chat with Agent'}
//         </button>
//       </div>

//       {showChat ? (
//         <div className="bg-gray-100 p-4 rounded-md mb-6 h-[500px] flex flex-col">
//           {/* Chat Header */}
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="text-lg font-semibold">Chat with {agent.name}</h4>
//             <button
//               onClick={() => setShowChat(false)}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               <XIcon size={20} />
//             </button>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 bg-white p-4 rounded-md overflow-y-auto mb-4 shadow-inner">
//             {messagesLoading ? (
//               <p className="text-center text-gray-500 text-sm">Loading messages...</p>
//             ) : messages.length === 0 ? (
//               <p className="text-center text-gray-500 text-sm">
//                 Start a conversation with the agent
//               </p>
//             ) : (
//               messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`mb-3 flex ${
//                     msg.senderId === userId ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[70%] p-3 rounded-lg ${
//                       msg.senderId === userId
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 text-gray-800'
//                     }`}
//                   >
//                     <p>{msg.text}</p>
//                     <p className="text-xs mt-1 opacity-70">
//                       {new Date(msg.timestamp).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Message Input */}
//           <form onSubmit={handleSendMessage} className="flex gap-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <h4 className="text-lg font-semibold mb-4">Schedule a Visit</h4>
          
//           {/* Name Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Your Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Email Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Phone Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Message Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Message
//             </label>
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               rows={4}
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Date/Time Fields */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Choose Date and Time
//             </label>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="relative">
//                 <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div className="relative">
//                 <ClockIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                 <input
//                   type="time"
//                   name="time"
//                   value={formData.time}
//                   onChange={handleChange}
//                   className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={bookingLoading}
//             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500"
//           >
//             {bookingLoading ? 'Scheduling...' : 'Schedule Visit'}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default AgentContact;

import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MessageSquareIcon, CalendarIcon, ClockIcon, XIcon } from 'lucide-react';
import io from 'socket.io-client';
import { useCreateBookingMutation } from '@/redux/services/BookingApi';
import { useGetMessagesQuery } from '@/redux/services/ChatApi';

const socket = io('http://localhost:3003');

const AgentContact = ({ agent, propertyId }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?._id;

  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    message: "I'm Interested In this property...",
    date: '',
    time: '',
  });

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const chatId = userId && agent?._id ? `${userId}-${agent._id}` : null;
  const { data: fetchedMessages, isLoading: messagesLoading } = useGetMessagesQuery(chatId, { skip: !showChat || !chatId });
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();

  useEffect(() => {
    if (showChat && fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages, showChat]);

  useEffect(() => {
    if (showChat && chatId) {
      socket.emit('joinChat', chatId);
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });
      return () => {
        socket.off('receiveMessage');
        socket.emit('leaveChat', chatId);
      };
    }
  }, [showChat, chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Please log in to schedule a visit');
      return;
    }

    // Debug: Log agent and propertyId to inspect their values
    console.log('Agent:', agent);
    console.log('Property ID:', propertyId);

    // Validate agent._id and propertyId
    if (!agent?._id) {
      alert('Agent information is missing or invalid');
      return;
    }
    if (!propertyId) {
      alert('Property ID is missing');
      return;
    }

    try {
      const response = await createBooking({
        userId,
        agentId: agent._id,
        propertyId,
        ...formData,
        date: new Date(formData.date),
      }).unwrap();

      alert('Visit scheduled successfully!');
      setFormData((prev) => ({
        ...prev,
        date: '',
        time: '',
      }));
    } catch (error) {
      console.error('Booking error:', error);
      alert(error?.data?.message || 'Error scheduling visit');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && userId) {
      const message = {
        chatId,
        senderId: userId,
        receiverId: agent._id,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  if (!userId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <p className="text-red-500 text-center py-4">
          You must be logged in to contact the agent.
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <p className="text-gray-500 text-center py-4">
          Agent information not available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <img
          src={agent.profilePic || 'https://via.placeholder.com/150'}
          alt={agent.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-gray-600">Property Agent</p>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <PhoneIcon size={16} className="mr-2 text-gray-600" />
          <span>{agent.phone || 'Not provided'}</span>
        </div>
        <div className="flex items-center">
          <MailIcon size={16} className="mr-2 text-gray-600" />
          <span>{agent.email}</span>
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center items-center hover:bg-blue-700 transition-colors"
        >
          <MessageSquareIcon size={16} className="mr-2" />
          {showChat ? 'Show Schedule Form' : 'Chat with Agent'}
        </button>
      </div>
      {showChat ? (
        <div className="bg-gray-100 p-4 rounded-md mb-6 h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Chat with {agent.name}</h4>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <XIcon size={20} />
            </button>
          </div>
          <div className="flex-1 bg-white p-4 rounded-md overflow-y-auto mb-4 shadow-inner">
            {messagesLoading ? (
              <p className="text-center text-gray-500 text-sm">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                Start a conversation with the agent
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${
                    msg.senderId === userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderId === userId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h4 className="text-lg font-semibold mb-4">Schedule a Visit</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Date and Time
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <ClockIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={bookingLoading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500"
          >
            {bookingLoading ? 'Scheduling...' : 'Schedule Visit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AgentContact;