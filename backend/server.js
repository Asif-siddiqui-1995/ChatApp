const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketServer = require("./socketServer");

dotenv.config({path: "./config.env"});

const PORT = process.env.PORT || process.env.API_PORT;

const http = require("http");
const server = http.createServer(app);
socketServer.registerSocketServer(server);
// console.log(process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDb Connected Successfully");
        server.listen(PORT, () => {
            console.log(`Server is Lisiting on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database Connection Failed. Server Not Started");
        console.log(err);
    });

// MONGO_URI = mongodbsrv://mohammadasifshahid:4cvnIFNIntDokxL0@cluster0.oqcju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
