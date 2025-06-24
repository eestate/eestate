import mongoose from "mongoose";

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

// Add index for faster querying
conversationSchema.index({ participants: 1, property: 1 }, { unique: true });
conversationSchema.index({ "participants": 1, "updatedAt": -1 });

// Virtual for last updated (auto-managed by timestamps)
conversationSchema.virtual('lastUpdated').get(function() {
  return this.updatedAt;
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;