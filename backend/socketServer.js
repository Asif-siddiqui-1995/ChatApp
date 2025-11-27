const authSocket = require("./middleware/authSocket");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const chatHistoryHandler = require("./socketHandlers/getMessageHistoryHandler");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const startTypingHandler = require("./socketHandlers/startTypingHandler");
const stopTypingHandler = require("./socketHandlers/stopTypingHandler");
const newMessageHandler = require("./socketHandlers/newMessageHandler");

const registerSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            method: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        authSocket(socket, next);
    });
    io.on("conection", (socket) => {
        console.log("User Connected");
        console.log(socket.id);

        // newConnectionHandler
        newConnectionHandler(socket, io);

        // Disconnect Handler
        socket.on("disconnect", () => {
            disconnectHandler(socket);
        });

        // newMesshaeHandler
        socket.on("new-message", (data) => {
            newMessageHandler(socket, data, io);
        });

        //Chat history handler
        socket.on("direct-chat-history", (data) => {
            chatHistoryHandler(socket, data);
        });

        // Start Typing Handler
        socket.on("start-typing", (data) => {
            startTypingHandler(socket, data, io);
        });

        // Stop Typing Handler
        socket.on("stop-typing", (data) => {
            stopTypingHandler(socket, data, io);
        });
    });
    // setInterval(() => {
    // }, [1000 * 8]);
};

module.exports = {registerSocketServer};
