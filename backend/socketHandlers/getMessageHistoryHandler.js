const Conversation = require("../Models/Conversation");

const chatHistoryHandler = async (socket, data) => {
    try {
        // conversation Id
        const {conversationId} = data;
        console.log(data, "conversation Id");
        // find the conversation by id and populate the messages
        const conversation = await Conversation.findById(conversationId)
            .select("message")
            .populate("message");
        if (!conversation) {
            return socket.emit("error", {message: "Conversation not found"});
        }
        // prepare the response data
        const res_data = {
            conversation,
            history: conversation.messages,
        };
        // Emit the chat history back to same socket
        socket.emit("chat-history", res_data);
    } catch (error) {
        // handle any error and send error event back
        socket.emit("error", {message: "Failed to fetch chat History", error});
    }
};

module.exports = chatHistoryHandler;
