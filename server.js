const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = process.env.NODE_ENV !== "production" ? require("morgan") : null;
const path = require("path");
const favicon = require("serve-favicon");

const authenticate = require("./api/auth/authenticate.js");
const authRouter = require("./api/auth/authRouter.js");
const usersRouter = require("./api/users/usersRouter.js");
const entriesRouter = require("./api/entries/entriesRouter.js");


const server = express();
server.use(favicon(path.join(__dirname, "./public/images", "favicon.ico")));
server.use(helmet());
server.use(cors());

if(morgan) {
    server.use(morgan("dev"));
}
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", authenticate, usersRouter);
server.use("/api/sleep", authenticate, entriesRouter);

server.use(express.static("public"));

server.use((req, res, next) => {
    //next({ code: 404, message: `The ${req.method} method for ${req.url} does not exist. Check the url and try again` })

    res.status(404).sendFile(path.join(__dirname, "./public", "not-found.html"));
});

server.use((err, req, res, next) => {
    res.status(err.code).json(err);
});

module.exports = server;