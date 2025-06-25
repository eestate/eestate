import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import { uploadChatImage } from '../middleware/chatUploadMiddleware.js';
import { getReceiverSocketId, getIO } from '../config/socket.js';
import mongoose from 'mongoose';

// Helper function to check if user is an agent
async function checkIfUserIsAgent(userId) {
  try {
    const user = await User.findById(userId).select('role');
    return user?.role === 'agent';
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAgent = await checkIfUserIsAgent(userId);

    let conversations;

    if (isAgent) {
      // Agent view - show all conversations
      conversations = await Conversation.find({ 
        participants: userId,
        isAgentConversation: true
      })
      .populate('participants', 'username profilePic name _id')
      .populate('initiatedFromProperty', 'title images')
      .populate('lastMessage', 'text senderId createdAt')
      .sort('-updatedAt');
    } else {
      // User view - show both agent and property conversations
      conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'username profilePic name _id')
        .populate('property', 'title images')
        .populate('initiatedFromProperty', 'title images')
        .sort('-updatedAt');
    }

    // Format the response
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );

      console.log("conv", conv);
      
      
      return {
        _id: conv._id,
        isAgentConversation: conv.isAgentConversation,
        otherParticipant: {
          _id: otherParticipant?._id,
          name: otherParticipant?.name || otherParticipant?.username || 'Unknown',
          profilePic: otherParticipant?.profilePic || null,
        },
        lastMessage: conv.lastMessage
          ? {
              text: conv.lastMessage.text,
              senderId: conv.lastMessage.senderId,
              createdAt: conv.lastMessage.createdAt,
            }
          : null,
        unreadCount: conv.unreadCount || {},
        properties: conv.isAgentConversation 
          ? conv.initiatedFromProperty 
          : conv.property ? [conv.property] : [],
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startConversation = async (req, res) => {
  const session = await mongoose.startSession();
  let conversation = null;

  try {
    const { participantId, propertyId } = req.body;
    const userId = req.user._id;
    const isAgent = await checkIfUserIsAgent(participantId);

    if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ error: "Invalid participant ID" });
    }
    if (propertyId && !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: "Invalid property ID" });
    }

    const sortedParticipants = [userId, participantId].sort((a, b) =>
      a.toString().localeCompare(b.toString())
    );

    console.log("Starting conversation", {
      userId,
      participantId,
      propertyId,
      isAgent,
      sortedParticipants,
    });

    let maxRetries = 3;
    let attempt = 1;

    while (attempt <= maxRetries) {
      session.startTransaction();
      try {
        console.log(`Attempt ${attempt}: Starting transaction`);

        const query = {
          participants: { $all: sortedParticipants.map(String) },
          isAgentConversation: isAgent,
          ...(isAgent ? { property: null } : { property: propertyId || null }),
        };
        console.log(`Attempt ${attempt}: Querying for conversation`, query);

        conversation = await Conversation.findOne(query, null, { session });

        if (conversation) {
          console.log(`Attempt ${attempt}: Found existing conversation`, {
            conversationId: conversation._id,
          });
        } else {
          console.log(`Attempt ${attempt}: No existing conversation, creating new one`);
          conversation = await Conversation.create(
            [
              {
                participants: sortedParticipants,
                property: isAgent ? null : propertyId || null,
                isAgentConversation: isAgent,
                initiatedFromProperty: [],
                unreadCount: {
                  [userId]: 0,
                  [participantId]: 0,
                },
              },
            ],
            { session }
          );
          conversation = conversation[0];
          console.log(`Attempt ${attempt}: Created new conversation`, {
            conversationId: conversation._id,
          });
        }

        await session.commitTransaction();
        console.log(`Attempt ${attempt}: Transaction committed`);
        break;
      } catch (error) {
        await session.abortTransaction();
        console.error(`Attempt ${attempt}: Transaction aborted`, {
          error: error.message,
          code: error.code,
        });

        if (
          error.code === 11000 ||
          error.errorLabels?.includes("TransientTransactionError")
        ) {
          if (attempt === maxRetries) {
            console.log("Max retries reached, attempting non-transactional find");
            conversation = await Conversation.findOne({
              participants: { $all: sortedParticipants.map(String) },
              isAgentConversation: isAgent,
              ...(isAgent ? { property: null } : { property: propertyId || null }),
            });
            if (conversation) {
              console.log("Found conversation outside transaction", {
                conversationId: conversation._id,
              });
              break;
            }
            return res.status(409).json({
              error: "Failed to start conversation after multiple attempts",
              code: "CONVERSATION_CONFLICT",
            });
          }
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 200 * Math.pow(2, attempt - 1)));
          continue;
        }
        throw error;
      } finally {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
      }
    }

    if (isAgent && propertyId) {
      const propId = new mongoose.Types.ObjectId(propertyId);
      console.log(`Updating initiatedFromProperty for conversation ${conversation._id}`);
      await Conversation.updateOne(
        { _id: conversation._id },
        { $addToSet: { initiatedFromProperty: propId } }
      );
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "username profilePic name _id")
      .populate("property", "title images")
      .populate("initiatedFromProperty", "title images");

    return res.status(200).json(populatedConversation);
  } catch (error) {
    console.error("Error in startConversation:", {
      message: error.message,
      code: error.code,
    });

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Conversation already exists",
        code: "CONVERSATION_EXISTS",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  } finally {
    session.endSession();
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