import mongoose from "mongoose";

// In Conversation model
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    // Add these new fields
  initiatedFromProperty: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    }],
    default: [], // Ensures it's always initialized as array
    validate: {
      validator: function(arr) {
        return Array.isArray(arr);
      },
      message: props => `${props.value} is not a valid array!`
    }
  },
    isAgentConversation: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// In your Conversation model
conversationSchema.index(
  { 
    participants: 1, 
    property: 1 
  },
  {
    unique: true,
    partialFilterExpression: {
      property: { $exists: true, $ne: null },
      isAgentConversation: false
    }
  }
);

conversationSchema.index(
  { 
    participants: 1, 
    isAgentConversation: 1 
  },
  { 
    partialFilterExpression: { 
      isAgentConversation: true ,
      property: null
    }
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;