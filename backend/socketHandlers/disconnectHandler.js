const User = require("../Models/User");

const disconnectHandler = async (socket) => {
    // log the disconnection
    console.log(`Uesr Disconnected ${socket.id}`);
    // update user document
    const user = await User.findOneAndUpdate(
        {socketId: socket.id},
        {socketId: undefined, status: "Offline"},
        {new: true, validateModifiedOnly: true}
    );
    if (user) {
        // broadcast to everyone excepth the disconnected user that user is disconnected
        socket.broadcast.emit("user-disconnected", {
            message: `User ${user.name} is Offline`,
            userId: user._id,
            status: "Offline",
        });
    } else {
        console.log(`User With Id ${socket.id} not found`);
    }
};

module.exports = disconnectHandler;
