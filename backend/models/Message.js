import mongoose from "mongoose";
import Conversation from "./Conversation.js"; // Make sure to import Conversation

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      validate: {
        validator: (v) => v === null || /^https?:\/\/.+\..+/.test(v),
        message: props => `${props.value} is not a valid URL!`
      }
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Helper function to get conversation participants
async function getConversationParticipants(conversationId) {
  const conversation = await Conversation.findById(conversationId).select('participants');
  return conversation?.participants || [];
}

messageSchema.pre('save', async function(next) {
  if (this.isNew) {
    // First update the conversation's last message reference
    await Conversation.findByIdAndUpdate(
      this.conversationId,
      { 
        lastMessage: this._id,
        $inc: {
          [`unreadCount.${this.senderId}`]: 0, // Initialize if not exists
        }
      }
    );
    
    // Then increment unread count for all participants except sender
    const participants = await getConversationParticipants(this.conversationId);
    const updateOperations = {};
    
    participants.forEach(participant => {
      if (participant.toString() !== this.senderId.toString()) {
        updateOperations[`unreadCount.${participant}`] = 1;
      }
    });
    
    if (Object.keys(updateOperations).length > 0) {
      await Conversation.findByIdAndUpdate(
        this.conversationId,
        { $inc: updateOperations }
      );
    }
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;