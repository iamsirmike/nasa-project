const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const planetRouter = require("./src/routes/planets.router");
const launchRouter = require("./src/routes/launch.router");
const userRouter = require("./src/routes/user.router");

const app = express();

//secures our server by adding headers. this is a middleware!
app.use(helmet());

//We use morgan to log our requests.
app.use(morgan("combined"));

app.use(express.json());

app.use("/planets", planetRouter);
app.use("/launches", launchRouter);

app.use("/auth", userRouter);
app.use("/auth", userRouter);
app.use("/user", userRouter);

module.exports = app;
