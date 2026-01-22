import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { io, getReceiverSocketId } from "../socket.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // ✅ Create message FIRST
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id,
    });

    chats.messages.push(newMessage._id);

    // ✅ Save to DB
    await Promise.all([chats.save(), newMessage.save()]);
    
    // 🔥 Emit AFTER save, using correct variable
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //delivered status update
      newMessage.status = "delivered";
  await newMessage.save();

      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for message mark as seen 

export const markMessagesAsSeen = async (req, res) => {
  
  try {
    console.log("HIT markMessagesAsSeen API");
    const { id: otherUserId } = req.params;
    const currentUserId = req.user._id;
    console.log("MARKING SEEN for:", otherUserId, currentUserId);
    
    // Update DB
    const result = await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: currentUserId,
        status: { $ne: "seen" },
      },
      { status: "seen" },
      
    );
     console.log("UPDATED COUNT:", result.modifiedCount);

    // 🔥 Notify sender in real-time
    const senderSocketId = getReceiverSocketId(otherUserId);
    if (senderSocketId) {

      io.to(senderSocketId).emit("messagesSeen", {
        from: currentUserId,
        to: otherUserId,
      });
    }
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("markMessagesAsSeen error:", error);
    res.status(500).json({ success: false,message: error.message, });
  }
};




 export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!chats) return res.status(200).send([]);
    const message=chats.messages;
    res.status(200).send(message)


  } catch (error) { 
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};