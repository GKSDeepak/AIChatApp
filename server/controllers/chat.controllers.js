const ChatHistory = require("../models/chatHistory");
const User = require("../models/user");

// Store Message Logic
exports.storeMessage = async (req, res) => {
    const { userId, message, sender } = req.body;

    try {
        const chat = new ChatHistory({ message, sender });
        await chat.save();

        await User.findByIdAndUpdate(userId, { $push: { chatHistory: chat._id } });
        
        res.status(200).send({ success: true, message: "Message stored successfully" });
    } catch (error) {
        console.error("Error storing message:", error);
        res.status(500).send({ success: false, message: "Failed to store message", error });
    }
};

// Get Chat History Logic
exports.getChatHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('chatHistory').exec();
        if (!user.chatHistory || user.chatHistory.length === 0) {
            return res.status(404).json({ success: false, message: 'No chat history found' });
        }

        res.status(200).send({ success: true, chatHistory: user.chatHistory });
    } catch (error) {
        console.error("Error retrieving chat history:", error);
        res.status(500).send({ success: false, message: "Failed to retrieve chat history", error });
    }
};
