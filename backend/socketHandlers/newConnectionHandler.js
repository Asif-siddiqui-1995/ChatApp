const User = require("../Models/User");
const newConnectionHandler = async (socket, io) => {
    const {userId} = socket.user;

    // log new user connected
    console.log(`User Connected: ${socket}`);

    // add socketId to user Record
    const user = await User.findByIdAndUpdate(
        userId,
        {
            socketId: socket.id,
            status: "Online",
        },
        {
            new: true,
            validateModifiedOnly: true,
        }
    );
    if (user) {
        // broadcast to everyone new user connected
        socket.broadcast.emit("user-connected", {
            message: `User ${user.name} has connected`,
            userId: user._id,
            status: "Online",
        });
    } else {
        console.log(`User With Id ${userId} not found`);
    }
};

module.exports = newConnectionHandler;
