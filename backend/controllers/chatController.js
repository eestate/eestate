// import User from "../models/User.js";
// import Message from "../models/Chat.js";
// import cloudinary from "../config/cloudinary.js";
// import { getReceiverSocketId, io } from "../config/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const loggedInUser = await User.findById(loggedInUserId).select("role");

//     let filteredUsers;
//     if (loggedInUser.role === "agent") {
//       filteredUsers = await User.find({ role: "user", _id: { $ne: loggedInUserId } }).select(
//         "name email profilePic role"
//       );
//     } else if (loggedInUser.role === "user") {
//       filteredUsers = await User.find({ role: "agent", _id: { $ne: loggedInUserId } }).select(
//         "name email profilePic role"
//       );
//     } else {
//       filteredUsers = [];
//     }

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     })
//       .populate("senderId", "name profilePic")
//       .populate("receiverId", "name profilePic")
//       .sort({ createdAt: 1 }); 

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error in getMessages controller:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     const receiver = await User.findById(receiverId);
//     if (!receiver) {
//       return res.status(404).json({ error: "Receiver not found" });
//     }

//     const sender = await User.findById(senderId);
//     if (
//       (sender.role === "user" && receiver.role !== "agent") ||
//       (sender.role === "agent" && receiver.role !== "user")
//     ) {
//       return res.status(403).json({ error: "Invalid chat participant" });
//     }

//     let imageUrl;
//     if (image) {
//       try {
//         const uploadResponse = await cloudinary.uploader.upload(image, {
//           folder: "chat_images",
//         });
//         imageUrl = uploadResponse.secure_url;
//       } catch (uploadError) {
//         console.error("Error uploading image to Cloudinary:", uploadError.message);
//         return res.status(500).json({ error: "Failed to upload image" });
//       }
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl,
//     });

//     await newMessage.save();

//     const populatedMessage = await Message.findById(newMessage._id)
//       .populate("senderId", "name profilePic")
//       .populate("receiverId", "name profilePic");

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", populatedMessage);
//     }

//     const senderSocketId = getReceiverSocketId(senderId);
//     if (senderSocketId) {
//       io.to(senderSocketId).emit("newMessage", populatedMessage);
//     }

//     res.status(201).json(populatedMessage);
//   } catch (error) {
//     console.error("Error in sendMessage controller:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

import User from "../models/User.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const loggedInUser = await User.findById(loggedInUserId).select("role");

    let filteredUsers = [];
    if (loggedInUser.role === "agent") {
      filteredUsers = await User.find({ role: "user", _id: { $ne: loggedInUserId } }).select(
        "name email profilePic role"
      );
    } else if (loggedInUser.role === "user") {
      filteredUsers = await User.find({ role: "agent", _id: { $ne: loggedInUserId } }).select(
        "name email profilePic role"
      );
    }

    // Fetch chats for these users
    const chats = await Chat.find({
      participants: { $in: [loggedInUserId] },
    })
      .populate("participants", "name profilePic role")
      .populate("lastMessage");

    // Map users to include chat info
    const usersWithChats = filteredUsers.map((user) => {
      const chat = chats.find((c) =>
        c.participants.some((p) => p._id.toString() === user._id.toString())
      );
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        chatId: chat?._id || null,
        lastMessage: chat?.lastMessage?.text || null,
        time: chat?.lastMessage?.createdAt || null,
        unread: chat?.unreadCounts.find((u) => u.userId.toString() === loggedInUserId.toString())?.count || 0,
      };
    });

    res.status(200).json(usersWithChats);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const myId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(myId)) {
      return res.status(403).json({ error: "Unauthorized or chat not found" });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "name profilePic")
      .populate("receiverId", "name profilePic")
      .sort({ createdAt: 1 });

    await Chat.updateOne(
      { _id: chatId, "unreadCounts.userId": myId },
      { $set: { "unreadCounts.$.count": 0 } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const sender = await User.findById(senderId);
    if (
      (sender.role === "user" && receiver.role !== "agent") ||
      (sender.role === "agent" && receiver.role !== "user")
    ) {
      return res.status(403).json({ error: "Invalid chat participant" });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        unreadCounts: [
          { userId: senderId, count: 0 },
          { userId: receiverId, count: 0 },
        ],
      });
      await chat.save();
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chat_images",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError.message);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      chatId: chat._id,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Update chat
    await Chat.updateOne(
      { _id: chat._id },
      {
        $set: { lastMessage: newMessage._id },
        $inc: { "unreadCounts.$[elem].count": 1 },
      },
      { arrayFilters: [{ "elem.userId": { $ne: senderId } }] }
    );

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name profilePic")
      .populate("receiverId", "name profilePic");

    // Emit to both users
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
      io.to(receiverSocketId).emit("updateChatList", chat);
    }

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", populatedMessage);
      io.to(senderSocketId).emit("updateChatList", chat);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};