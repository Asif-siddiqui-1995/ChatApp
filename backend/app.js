const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const cors = require("cors");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
const routes = require("./routes/index");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json({limit: "10kb"}));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
    max: 3000,
    windowMs: 60 * 60 * 1000, //In one hour
    message: "Too many request from this IP, Plesase try again in an hour",
});

app.use("/api", limiter);

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(mongosanitize());

app.use(xss());

// Add Routes
app.use(routes);

module.exports = app;
