

// import React, { useState, useEffect, useRef } from "react";
// import {
//   UserIcon,
//   MailIcon,
//   Send,
//   PhoneIcon,
//   MessageSquareIcon,
//   CalendarIcon,
//   ClockIcon,
//   XIcon,
//   Paperclip,
//   SendIcon,
// } from "lucide-react";
// import { Snackbar, Alert } from "@mui/material";
// import { initializeSocket } from "@/utils/socket";
// import { useCreateBookingMutation } from "@/redux/services/BookingApi";
// import {
//   useGetMessagesQuery,
//   useSendMessageMutation,
//   useSendTextMessageMutation,
//   useStartConversationMutation,
// } from "@/redux/services/ChatApi";

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { UserIcon, MailIcon, Send, PhoneIcon, MessageSquareIcon, CalendarIcon, ClockIcon, XIcon, Paperclip, SendIcon } from 'lucide-react';
// import { initializeSocket } from '@/utils/socket';
// import { useCreateBookingMutation } from '@/redux/services/BookingApi';
// import { useGetMessagesQuery, useSendMessageMutation, useSendTextMessageMutation, useStartConversationMutation } from '@/redux/services/ChatApi';


// const AgentStatusIndicator = ({ isOnline }) => (
//   <div className="flex items-center mb-2">
//     <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
//     <span className="text-sm text-gray-600">
//       {isOnline ? 'Online' : 'Offline'}
//     </span>
//   </div>
// );

// const AgentContact = ({ agent, propertyId }) => {
//   const userData = JSON.parse(localStorage.getItem("user"));
//   const userId = userData?._id;
//   const [imageFile, setImageFile] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [showChat, setShowChat] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [error, setError] = useState(null);
//   const chatEndRef = useRef(null);
//   const [currentConversationId, setCurrentConversationId] = useState(null);

//   const [agentTyping, setAgentTyping] = useState(false);
//   const [agentOnline, setAgentOnline] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };


//   const [formData, setFormData] = useState({
//     name: userData?.name || "",
//     email: userData?.email || "",
//     phone: userData?.phone || "",
//     message: "I'm Interested In this property...",
//     date: "",
//     time: "",
//   });

//   const [startConversation] = useStartConversationMutation();
//   const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
//   const [sendTextMessage, { isLoading: sendingTextMessage }] =
//     useSendTextMessageMutation();
//   const [createBooking, { isLoading: bookingLoading }] =
//     useCreateBookingMutation();

//   const {
//     data: messages = [],
//     isLoading: messagesLoading,
//     isError: messagesError,
//     error: messagesErrorDetails,
//     refetch: refetchMessages,
//   } = useGetMessagesQuery(currentConversationId, {
//     skip: !currentConversationId,
//   });

//   // Initialize socket connection
//   useEffect(() => {

//     if (!userId) return;

//     const socketInstance = initializeSocket(userId);
//     setSocket(socketInstance);


//     if (messagesError) {
//       setError("Failed to load messages. Please try again.");
//     }
//   }, [messagesError, messagesErrorDetails]);

//   useEffect(() => {
//     if (userId) {
//       const socketInstance = initializeSocket(userId);
//       setSocket(socketInstance);
//       return () => socketInstance.disconnect();
//     }


//     if (!userId) return;

//     const socketInstance = initializeSocket(userId);
//     setSocket(socketInstance);


//     return () => {
//       if (socketInstance) {
//         socketInstance.disconnect();
//       }
//     };

//   }, [userId]);

//   // Handle agent presence updates
//   useEffect(() => {
//     if (!socket || !agent?._id) return;

//     const handleAgentOnline = (agentId) => {
//       if (agentId === agent._id) {
//         setAgentOnline(true);
//       }
//     };

//     const handleAgentOffline = (agentId) => {
//       if (agentId === agent._id) {
//         setAgentOnline(false);
//       }
//     };


//     if (!showChat || !agent?._id || !propertyId || !userId || !socket) return;

//     const initializeChat = async () => {
//       try {
//         const conversation = await startConversation({
//           participantId: agent._id,
//           propertyId,
//         }).unwrap();
//         setCurrentConversationId(conversation._id.toString());
//         socket.emit("joinConversation", conversation._id.toString());
//       } catch (error) {
//         setError("Failed to start conversation. Please try again.");
//         console.log("Failed to start conversation", error);


//     if (!socket || !agent?._id) return;

//     const handleAgentOnline = (agentId) => {
//       if (agentId === agent._id) {
//         setAgentOnline(true);
//       }
//     };

//     const handleAgentOffline = (agentId) => {
//       if (agentId === agent._id) {
//         setAgentOnline(false);


//       }
//     };


//     socket.on('agentOnline', handleAgentOnline);
//     socket.on('agentOffline', handleAgentOffline);

//     return () => {

//       socket.off('agentOnline', handleAgentOnline);
//       socket.off('agentOffline', handleAgentOffline);
//     };
//   }, [socket, agent?._id]);


//       if (socket && currentConversationId) {
//         socket.emit("leaveConversation", currentConversationId);
//       }

//       socket.off('agentOnline', handleAgentOnline);
//       socket.off('agentOffline', handleAgentOffline);

//     };
//   }, [socket, agent?._id]);


//   useEffect(() => {
//     if (currentConversationId) {
//       refetchMessages();

//   // Initialize chat when shown
//   const initializeChat = useCallback(async () => {
//     if (!agent?._id || !propertyId || !userId || !socket) return;

//     try {



//       const conversation = await startConversation({
//         participantId: agent._id,
//         propertyId,
//         isAgent: true
//       }).unwrap();

//       setCurrentConversationId(conversation._id.toString());
//       socket.emit('joinConversation', conversation._id.toString());
//       socket.emit('joinAgentChannel', agent._id);
      

//     } catch (error) {
//       console.error('Failed to start conversation:', error);
//       setError(error.data?.message || 'Failed to start conversation. Please try again.');

//     }
//   }, [agent?._id, propertyId, userId, socket,userData?.token, startConversation]);

//   useEffect(() => {
//     if (showChat) {
//       initializeChat();
//     }

//     return () => {
//       if (socket && currentConversationId) {
//         socket.emit('leaveConversation', currentConversationId);
//       }
//     };
//   }, [showChat, initializeChat, socket, currentConversationId]);


//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, messagesLoading]);

//     if (showChat) {
//       initializeChat();
//     }

//     return () => {
//       if (socket && currentConversationId) {
//         socket.emit('leaveConversation', currentConversationId);
//       }
//     };
//   }, [showChat, initializeChat, socket, currentConversationId]);


//   // Handle incoming messages
//   useEffect(() => {
//     if (!socket || !currentConversationId) return;

//     const handleNewMessage = (data) => {

//       if (data.conversationId === currentConversationId) {

//       if (data.conversationId.toString() === currentConversationId.toString()) {


//       if (data.conversationId.toString() === currentConversationId.toString()) {

//       if (data.conversationId === currentConversationId) {


//         refetchMessages();
//       }
//     };

//     socket.on("newMessage", handleNewMessage);
//     return () => socket.off("newMessage", handleNewMessage);
//   }, [socket, currentConversationId, refetchMessages]);


//   // Handle typing indicators
//   useEffect(() => {
//     if (!socket || !currentConversationId) return;

//     const handleTyping = (data) => {
//       if (data.conversationId === currentConversationId && data.userId !== userId) {
//         setAgentTyping(data.isTyping);
//       }
//     };

//     socket.on('typing', handleTyping);
//     return () => {
//       socket.off('typing', handleTyping);
//     };
//   }, [socket, currentConversationId, userId]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending typing indicators
//   const handleTypingIndicator = useCallback((isTyping) => {
//     if (!socket || !currentConversationId) return;
    
//     clearTimeout(typingTimeoutRef.current);
    
//     if (isTyping) {
//       socket.emit('typing', {
//         conversationId: currentConversationId,
//         userId,
//         isTyping: true
//       });
//     } else {
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit('typing', {
//           conversationId: currentConversationId,
//           userId,
//           isTyping: false
//         });
//       }, 1000);
//     }
//   }, [socket, currentConversationId, userId]);

//   const handleMessageChange = (e) => {
//     const text = e.target.value;
//     setNewMessage(text);
//     handleTypingIndicator(text.trim().length > 0);
//   };


//   // Handle typing indicators
//   useEffect(() => {
//     if (!socket || !currentConversationId) return;

//     const handleTyping = (data) => {
//       if (data.conversationId === currentConversationId && data.userId !== userId) {
//         setAgentTyping(data.isTyping);
//       }
//     };

//     socket.on('typing', handleTyping);
//     return () => {
//       socket.off('typing', handleTyping);
//     };
//   }, [socket, currentConversationId, userId]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending typing indicators
//   const handleTypingIndicator = useCallback((isTyping) => {
//     if (!socket || !currentConversationId) return;
    
//     clearTimeout(typingTimeoutRef.current);
    
//     if (isTyping) {
//       socket.emit('typing', {
//         conversationId: currentConversationId,
//         userId,
//         isTyping: true
//       });
//     } else {
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit('typing', {
//           conversationId: currentConversationId,
//           userId,
//           isTyping: false
//         });
//       }, 1000);
//     }
//   }, [socket, currentConversationId, userId]);

//   const handleMessageChange = (e) => {
//     const text = e.target.value;
//     setNewMessage(text);
//     handleTypingIndicator(text.trim().length > 0);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() && !imageFile) return;
//     if (!currentConversationId || !socket) {
//       setError("Chat not initialized. Please try again.");
//       return;
//     }

//     try {
//       let result;
//       if (newMessage.trim() && !imageFile) {
//         result = await sendTextMessage({

//         await sendTextMessage({

//         result = await sendTextMessage({

//           conversationId: currentConversationId,
//           text: newMessage,
//         }).unwrap();
//       } else {
//         const formData = new FormData();
//         if (newMessage.trim()) formData.append("text", newMessage);
//         if (imageFile) formData.append("image", imageFile);


//         result = await sendMessage({
//         await sendMessage({

//         result = await sendMessage({

//           conversationId: currentConversationId,
//           body: formData,
//         }).unwrap();
//       }

//       socket.emit("newMessage", {
//         conversationId: currentConversationId,
//         senderId: userId,
//         messageId: result._id,
//       });

//     } catch (error) {
//       setError(`Failed to send message: ${error.message || "Unknown error"}`);
//     } finally {
//       setNewMessage("");



//       setNewMessage('');

//       setImageFile(null);
//       handleTypingIndicator(false);

//     } catch (error) {
//       console.error('Failed to send message:', error);
//       setError(error.data?.message || 'Failed to send message');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!userId)
//       return showSnackbar("Please log in to schedule a visit", "error");
//     if (!agent?._id)
//       return showSnackbar("Agent information is missing or invalid", "error");
//     if (!propertyId) return showSnackbar("Property ID is missing", "error");

//     try {
//       await createBooking({
//         userId,
//         agentId: agent._id,
//         propertyId,
//         ...formData,
//         date: new Date(formData.date),
//       }).unwrap();

//       showSnackbar("Visit scheduled successfully!", "success");
//       setFormData((prev) => ({ ...prev, date: "", time: "" }));
//     } catch (error) {
//       showSnackbar(error?.data?.message || "Error scheduling visit", "error");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (

//     <>
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <div className="flex items-center mb-6">
//           <img
//             src={agent.profilePic || "https://via.placeholder.com/150"}


//     <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//       <div className='mb-6'>
//         <div className="flex items-center">
//           <img
//             src={agent.profilePic || 'https://via.placeholder.com/150'}

//             alt={agent.name}
//             className="w-16 h-16 rounded-full object-cover mr-4"
//           />
//           <div>
//             <h3 className="text-xl font-semibold">{agent.name}</h3>
//             <p className="text-gray-600">Property Agent</p>
//             <AgentStatusIndicator isOnline={agentOnline} />


//             <AgentStatusIndicator isOnline={agentOnline} />


//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex items-center mb-2">
//             <PhoneIcon size={16} className="mr-2 text-gray-600" />
//             <span>{agent.phone || "Not provided"}</span>
//           </div>
//           <div className="flex items-center">
//             <MailIcon size={16} className="mr-2 text-gray-600" />
//             <span>{agent.email}</span>
//           </div>

//         </div>

//         <div className="mb-6">
//           <button
//             onClick={() => setShowChat(!showChat)}
//             className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center items-center hover:bg-blue-700 transition-colors"
//           >
//             <MessageSquareIcon size={16} className="font-manrope mr-2" />
//             {showChat ? "Show Schedule Form" : "Chat with Agent"}
//           </button>
//         </div>

//         {showChat ? (
//           <div className="bg-gray-100 p-4 rounded-md mb-6 h-[500px] flex flex-col">
//             <div className="flex justify-between items-center mb-4">
//               <h4 className="font-manrope text-lg font-semibold">
//                 Chat with {agent.name}
//               </h4>

//         </div>

//         <div className="mb-6">
//           <button
//             onClick={() => setShowChat(!showChat)}
//             className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center items-center hover:bg-blue-700 transition-colors"
//           >
//             <MessageSquareIcon size={16} className="font-manrope mr-2" />
//             {showChat ? "Show Schedule Form" : "Chat with Agent"}
//           </button>
//         </div>


//         {showChat ? (
//           <div className="bg-gray-100 p-4 rounded-md mb-6 h-[500px] flex flex-col">
//             <div className="flex justify-between items-center mb-4">
//               <h4 className="font-manrope text-lg font-semibold">
//                 Chat with {agent.name}
//               </h4>

//       {showChat ? (
//         <div className="bg-gray-100 p-4 rounded-md mb-6 h-[500px] flex flex-col">
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="font-manrope text-lg font-semibold">Chat with {agent.name}</h4>
//             <button
//               onClick={() => setShowChat(false)}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               <XIcon size={20} />
//             </button>
//           </div>
          
//           {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          
//           {imageFile && (
//             <div className="relative mb-2">
//               <img
//                 src={URL.createObjectURL(imageFile)}
//                 alt="Preview"
//                 className="max-w-xs max-h-32 rounded-md"
//               />


//               <button
//                 onClick={() => setShowChat(false)}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 <XIcon size={20} />
//               </button>
//             </div>

//             {error && <p className="text-red-500 text-center mb-2">{error}</p>}
//             {imageFile && (
//               <div className="relative mb-2">
//                 <img
//                   src={URL.createObjectURL(imageFile)}
//                   alt="Preview"
//                   className="max-w-xs max-h-32 rounded-md"
//                 />
//                 <button
//                   onClick={() => setImageFile(null)}
//                   className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
//                 >
//                   <XIcon size={16} />
//                 </button>
//               </div>
//             )}

//             <div className="flex-1 bg-white p-4 rounded-md overflow-y-auto mb-4 shadow-inner">
//               {messagesLoading ? (
//                 <p className="text-center text-gray-500 text-sm">
//                   Loading messages...
//                 </p>
//               ) : messagesError ? (
//                 <p className="text-center text-red-500 text-sm">
//                   Error loading messages
//                 </p>
//               ) : messages.length === 0 ? (
//                 <p className="font-manrope text-center text-gray-500 text-sm">
//                   Start a conversation with the agent
//                 </p>
//               ) : (
//                 messages.map((msg) => {
//                   const senderId =
//                     typeof msg.senderId === "object"
//                       ? msg.senderId?._id.toString()
//                       : msg.senderId.toString();
//                   const isCurrentUser = senderId === userId;
//                   const messageDate = new Date(msg.createdAt);
//                   console.log("Rendering message:", msg);

//                   return (
//                     <div
//                       key={msg._id}
//                       className={`mb-3 flex ${
//                         isCurrentUser ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`font-manrope max-w-[70%] p-3 rounded-lg ${
//                           isCurrentUser
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-200 text-gray-800"
//                         }`}
//                       >
//                         {msg.text && <p>{msg.text}</p>}
//                         {msg.image && (
//                           <img
//                             src={msg.image}
//                             alt="Chat image"
//                             className="max-w-full rounded-md mt-2"
//                           />
//                         )}
//                         <p className="font-manrope text-xs mt-1 opacity-70">
//                           {messageDate.toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </p>
//                       </div>

//                     </div>
//                   );
//                 })
//               )}
//               <div ref={chatEndRef} />
//             </div>


//                     </div>
//                   );
//                 })
//               )}
//               <div ref={chatEndRef} />
//             </div>

//           )}

//           <div className="flex-1 bg-white p-4 rounded-md overflow-y-auto mb-4 shadow-inner">
//             {messagesLoading ? (
//               <p className="text-center text-gray-500 text-sm">Loading messages...</p>
//             ) : messagesError ? (
//               <p className="text-center text-red-500 text-sm">Error loading messages</p>
//             ) : messages.length === 0 ? (
//               <p className="font-manrope text-center text-gray-500 text-sm">
//                 Start a conversation with the agent
//               </p>
//             ) : (
//               <>
// {messages.map((msg) => {
//   // Safely get senderId whether it's populated or just an ID string
//   const senderId = msg.senderId?._id?.toString() || msg.senderId?.toString();
//   const isCurrentUser = senderId === userId;
//   const messageDate = msg.createdAt ? new Date(msg.createdAt) : new Date();

//   return (
//     <div
//       key={msg._id}
//       className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
//     >
//       <div
//         className={`font-manrope max-w-[70%] p-3 rounded-lg ${
//           isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
//         }`}
//       >
//         {msg.text && <p>{msg.text}</p>}
//         {msg.image && (
//           <img
//             src={msg.image}
//             alt="Chat image"
//             className="max-w-full rounded-md mt-2"
//           />
//         )}
//         <p className="font-manrope text-xs mt-1 opacity-70">
//           {messageDate.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </p>
//       </div>
//     </div>
//   );
// })}
//                 {agentTyping && (
//                   <div className="flex mb-2 justify-start">
//                     <div className="bg-gray-200 text-gray-800 p-2 rounded-lg">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                         <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={chatEndRef} />
//               </>
//             )}
//           </div>



//             <form onSubmit={handleSendMessage} className="flex gap-2">
//               <div className="flex-1 flex items-center">
//                 <label className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
//                   <Paperclip className="w-5 h-5" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={(e) => setImageFile(e.target.files[0])}
//                   />
//                 </label>
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type your message..."
//                   className="font-manrope flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   disabled={
//                     messagesLoading || sendingMessage || sendingTextMessage
//                   }
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
//                 disabled={
//                   (!newMessage.trim() && !imageFile) ||
//                   messagesLoading ||
//                   sendingMessage ||
//                   sendingTextMessage
//                 }
//               >
//                 <SendIcon />
//               </button>
//             </form>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <h4 className="text-lg font-semibold mb-4">Schedule a Visit</h4>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Your Name
//               </label>
//               <input
//                 type="text"

//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required


//                 value={newMessage}
//                 onChange={handleMessageChange}
//                 placeholder="Type your message..."
//                 className="font-manrope flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={messagesLoading || sendingMessage || sendingTextMessage}


//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Message
//               </label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Choose Date and Time
//               </label>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="relative">
//                   <CalendarIcon
//                     size={16}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                   />
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div className="relative">
//                   <ClockIcon
//                     size={16}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                   />
//                   <input
//                     type="time"
//                     name="time"
//                     value={formData.time}
//                     onChange={handleChange}
//                     className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={bookingLoading}
//               className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500"
//             >
//               {bookingLoading ? "Scheduling..." : "Schedule Visit"}
//             </button>
//           </form>
//         )}
//       </div>

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default AgentContact;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MailIcon, PhoneIcon, MessageSquareIcon, CalendarIcon, ClockIcon, XIcon, Paperclip, Send } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { initializeSocket } from '@/utils/socket';
import { useCreateBookingMutation } from '@/redux/services/BookingApi';
import { useGetMessagesQuery, useSendMessageMutation, useSendTextMessageMutation, useStartConversationMutation } from '@/redux/services/ChatApi';

const AgentStatusIndicator = ({ isOnline }) => (
  <div className="flex items-center mb-2">
    <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
    <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
  </div>
);

const AgentContact = ({ agent, propertyId }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?._id;
  const [imageFile, setImageFile] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    message: "I'm Interested In this property...",
    date: '',
    time: '',
  });

  const [startConversation] = useStartConversationMutation();
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [sendTextMessage, { isLoading: sendingTextMessage }] = useSendTextMessageMutation();
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useGetMessagesQuery(currentConversationId, { skip: !currentConversationId });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    const socketInstance = initializeSocket(userId);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Handle agent presence updates
  useEffect(() => {
    if (!socket || !agent?._id) return;

    const handleAgentOnline = (agentId) => {
      if (agentId === agent._id) setAgentOnline(true);
    };

    const handleAgentOffline = (agentId) => {
      if (agentId === agent._id) setAgentOnline(false);
    };

    socket.on('agentOnline', handleAgentOnline);
    socket.on('agentOffline', handleAgentOffline);

    return () => {
      socket.off('agentOnline', handleAgentOnline);
      socket.off('agentOffline', handleAgentOffline);
    };
  }, [socket, agent?._id]);

  // Initialize chat when shown
  const initializeChat = useCallback(async () => {
    if (!agent?._id || !propertyId || !userId || !socket) return;

    try {
      const conversation = await startConversation({
        participantId: agent._id,
        propertyId,
        isAgent: true,
      }).unwrap();
      setCurrentConversationId(conversation._id.toString());
      socket.emit('joinConversation', conversation._id.toString());
      socket.emit('joinAgentChannel', agent._id);
    } catch (error) {
      setError(error.data?.message || 'Failed to start conversation. Please try again.');
    }
  }, [agent?._id, propertyId, userId, socket, startConversation]);

  useEffect(() => {
    if (showChat) {
      initializeChat();
    }

    return () => {
      if (socket && currentConversationId) {
        socket.emit('leaveConversation', currentConversationId);
      }
    };
  }, [showChat, initializeChat, socket, currentConversationId]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !currentConversationId) return;

    const handleNewMessage = (data) => {
      if (data.conversationId === currentConversationId) {
        refetchMessages();
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, currentConversationId, refetchMessages]);

  // Handle typing indicators
  useEffect(() => {
    if (!socket || !currentConversationId) return;

    const handleTyping = (data) => {
      if (data.conversationId === currentConversationId && data.userId !== userId) {
        setAgentTyping(data.isTyping);
      }
    };

    socket.on('typing', handleTyping);
    return () => socket.off('typing', handleTyping);
  }, [socket, currentConversationId, userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending typing indicators
  const handleTypingIndicator = useCallback(
    (isTyping) => {
      if (!socket || !currentConversationId) return;

      clearTimeout(typingTimeoutRef.current);

      if (isTyping) {
        socket.emit('typing', {
          conversationId: currentConversationId,
          userId,
          isTyping: true,
        });
      } else {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('typing', {
            conversationId: currentConversationId,
            userId,
            isTyping: false,
          });
        }, 1000);
      }
    },
    [socket, currentConversationId, userId]
  );

  const handleMessageChange = (e) => {
    const text = e.target.value;
    setNewMessage(text);
    handleTypingIndicator(text.trim().length > 0);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;
    if (!currentConversationId || !socket) {
      setError('Chat not initialized. Please try again.');
      return;
    }

    try {
      let result;
      if (newMessage.trim() && !imageFile) {
        result = await sendTextMessage({
          conversationId: currentConversationId,
          text: newMessage,
        }).unwrap();
      } else {
        const formData = new FormData();
        if (newMessage.trim()) formData.append('text', newMessage);
        if (imageFile) formData.append('image', imageFile);

        result = await sendMessage({
          conversationId: currentConversationId,
          body: formData,
        }).unwrap();
      }

      socket.emit('newMessage', {
        conversationId: currentConversationId,
        senderId: userId,
        messageId: result._id,
      });

      setNewMessage('');
      setImageFile(null);
      handleTypingIndicator(false);
    } catch (error) {
      setError(error.data?.message || 'Failed to send message');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return showSnackbar('Please log in to schedule a visit', 'error');
    if (!agent?._id) return showSnackbar('Agent information is missing or invalid', 'error');
    if (!propertyId) return showSnackbar('Property ID is missing', 'error');

    try {
      await createBooking({
        userId,
        agentId: agent._id,
        propertyId,
        ...formData,
        date: new Date(formData.date),
      }).unwrap();
      showSnackbar('Visit scheduled successfully!', 'success');
      setFormData((prev) => ({ ...prev, date: '', time: '' }));
    } catch (error) {
      showSnackbar(error?.data?.message || 'Error scheduling visit', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center">
          <img
            src={agent.profilePic || 'https://via.placeholder.com/150'}
            alt={agent.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold">{agent.name}</h3>
            <p className="text-gray-600">Property Agent</p>
            <AgentStatusIndicator isOnline={agentOnline} />
          </div>
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

          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          {imageFile && (
            <div className="relative mb-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="max-w-xs max-h-32 rounded-md"
              />
              <button
                onClick={() => setImageFile(null)}
                className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
              >
                <XIcon size={16} />
              </button>
            </div>
          )}

          <div className="flex-1 bg-white p-4 rounded-md overflow-y-auto mb-4 shadow-inner">
            {messagesLoading ? (
              <p className="text-center text-gray-500 text-sm">Loading messages...</p>
            ) : messagesError ? (
              <p className="text-center text-red-500 text-sm">Error loading messages</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">Start a conversation with the agent</p>
            ) : (
              <>
                {messages.map((msg) => {
                  const senderId = msg.senderId?._id?.toString() || msg.senderId?.toString();
                  const isCurrentUser = senderId === userId;
                  const messageDate = msg.createdAt ? new Date(msg.createdAt) : new Date();

                  return (
                    <div
                      key={msg._id}
                      className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {msg.text && <p>{msg.text}</p>}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Chat image"
                            className="max-w-full rounded-md mt-2"
                          />
                        )}
                        <p className="text-xs mt-1 opacity-70">
                          {messageDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {agentTyping && (
                  <div className="flex mb-2 justify-start">
                    <div className="bg-gray-200 text-gray-800 p-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1 flex items-center">
              <label className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </label>
              <input
                type="text"
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={messagesLoading || sendingMessage || sendingTextMessage}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={(!newMessage.trim() && !imageFile) || messagesLoading || sendingMessage || sendingTextMessage}
            >
              <Send />
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h4 className="text-lg font-semibold mb-4">Schedule a Visit</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Date and Time</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <CalendarIcon
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
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
                <ClockIcon
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AgentContact;