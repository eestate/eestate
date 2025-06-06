
// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema(
//   {
//     participants: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//     ], 
//     lastMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//       default: null,
//     }, 
//     unreadCounts: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         count: {
//           type: Number,
//           default: 0,
//         },
//       },
//     ], 
//   },
//   { timestamps: true }
// );

// chatSchema.index(
//   { participants: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       participants: { $size: 2 }, 
//     },
//   }
// );

// const Chat = mongoose.model("Chat", chatSchema);

// export default Chat;

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    unreadCounts: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

chatSchema.index(
  { participants: 1 },
  {
    unique: true,
    partialFilterExpression: {
      participants: { $size: 2 },
    },
  }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;