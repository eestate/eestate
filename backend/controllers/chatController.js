import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { uploadChatImage } from '../middleware/chatUploadMiddleware.js';
import { getReceiverSocketId, getIO } from '../config/socket.js';

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching conversations for:', { userId });

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username profilePic name _id')
      .populate('property', 'title images')
      .sort('-updatedAt');

    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      return {
        _id: conv._id,
        name: otherParticipant?.name || otherParticipant?.username || 'Unknown',
        profilePic: otherParticipant?.profilePic || null,
        lastMessage: conv.lastMessage
          ? {
              text: conv.lastMessage.text,
              senderId: conv.lastMessage.senderId,
              createdAt: conv.lastMessage.createdAt,
            }
          : null,
        unreadCount: conv.unreadCount || {},
        property: conv.property
          ? { title: conv.property.title, image: conv.property.images?.[0] }
          : null,
      };
    });

    console.log('Fetched conversations:', formattedConversations.length);
    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error in getConversations:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startConversation = async (req, res) => {
  try {
    const { participantId, propertyId } = req.body;
    const userId = req.user._id;
    console.log('Starting conversation:', { userId, participantId, propertyId });

    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId], $size: 2 },
      property: propertyId || null,
    });

    if (existingConversation) {
      console.log('Existing conversation found:', existingConversation._id);
      return res.status(200).json(existingConversation);
    }

    const newConversation = await Conversation.create({
      participants: [userId, participantId],
      property: propertyId || null,
      unreadCount: {
        [userId]: 0,
        [participantId]: 0,
      },
    });

    console.log('New conversation created:', newConversation._id);
    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error in startConversation:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    console.log('Fetching messages for:', { userId, conversationId });

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      console.log('No conversation found or user not authorized:', { conversationId, userId });
      return res.status(403).json({ error: 'Conversation not found or unauthorized' });
    }

    const messages = await Message.find({ conversationId })
      .sort('createdAt')
      .populate('senderId', 'username avatar name _id');

    console.log('Fetched messages:', messages.length);

    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const text = req.body?.text || ''; // Fallback to empty string
    const senderId = req.user._id;
    const imageFile = req.file;

    console.log('sendMessage - Processing:', {
      conversationId,
      senderId,
      text,
      hasImage: !!imageFile,
      body: req.body,
      file: imageFile ? { originalname: imageFile.originalname, size: imageFile.size } : null,
    });

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    });

    if (!conversation) {
      console.log('Conversation not found or unauthorized:', { conversationId, senderId });
      return res.status(403).json({ error: 'Not authorized to send in this conversation' });
    }

    let imageUrl;
    if (imageFile) {
      console.log('Uploading image:', { originalname: imageFile.originalname, size: imageFile.size });
      const result = await uploadChatImage(imageFile);
      imageUrl = result?.secure_url || null;
      console.log('Image upload result:', { imageUrl });
    }

    if (!text && !imageUrl) {
      console.log('No message content provided:', { conversationId, senderId });
      return res.status(400).json({ error: 'Message text or image is required' });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      text,
      image: imageUrl || null,
      readBy: [senderId],
    });

    const receiverId = conversation.participants.find(
      (p) => p.toString() !== senderId.toString()
    );

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      $inc: { [`unreadCount.${receiverId}`]: 1 },
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      'senderId',
      'username avatar name _id'
    );

    const io = getIO();
    console.log('Emitting newMessage to conversation room:', `conversation:${conversationId}`);
    io.to(`conversation:${conversationId}`).emit('newMessage', {
      conversationId,
      message: populatedMessage,
      sender: {
        _id: req.user._id,
        name: req.user.name || req.user.username,
        avatar: req.user.avatar,
      },
    });

    if (conversation.property) {
      console.log('Emitting propertyMessage to:', `property_${conversation.property}`);
      io.to(`property_${conversation.property}`).emit('propertyMessage', {
        conversationId,
        propertyId: conversation.property,
        lastMessage: text || 'Image',
      });
    }

    io.emit('updateChatList');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error in sendMessage:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      requestFile: req.file,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};