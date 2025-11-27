const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");

const newMessageHandler = async (socket, data, io) => {
    console.log(data, "new-message");
    const {message, conversationId} = data;
    const {author, content, media, audioUrl, document, type, giphyUrl} =
        message;
    try {
        // find the conversation by conversation Id
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return socket.emit("error", {message: "Conversation not Found!"});
        }
        // create a new message using the message model
        const newMessage = await Message.create({
            author,
            content,
            media,
            audioUrl,
            document,
            type,
            giphyUrl,
        });
        // post the message id to message array in conversation
        conversation.message.push(newMessage._id);
        // populate the conversation witgh messages and participants

        const updatedConversation = await Conversation.findById(conversationId)
            .populate("messsages")
            .populate("participants");
        // find the online participants
        const onlineParticipants = updatedConversation.participants.filter(
            (participant) =>
                participant.status === "Online" && participant.socketId
        );
        console.log(onlineParticipants);
        //emit the 'new-message' to online participants
        onlineParticipants.foreach((participant) => {
            console.log(participant.socketId);
            io.to(participant.socketId).emit("new-direct-chat", {
                conversationId: conversationId,
                message: newMessage,
            });
        });
    } catch (error) {
        console.error("Error handling new message");
        socket.emit("error", {message: "Failed to send message"});
    }
};
module.export = newMessageHandler;
