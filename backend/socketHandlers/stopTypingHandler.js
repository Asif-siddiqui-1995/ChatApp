const User = require("../Models/User");

const stopTypingHandler = async (socket, data, io) => {
    const {userId, conversationId} = data;
    //userId of other participant who recieved typing status

    // fetch user by userId
    const user = await User.findById(userId);

    if (user && user.status === "Online" && user.socketId) {
        const dataToSend = {
            conversationId,
            typing: false,
        };
        // Emit'start typing' event to the socketId of the user
        io.to(user.socketId).emit("stop-typing", dataToSend);
    } else {
        // user is offline dont emit any event
        console.log(
            `User with Id ${userId} is offline, Not Emitting Typing Status`
        );
    }
};
module.exports = stopTypingHandler;
