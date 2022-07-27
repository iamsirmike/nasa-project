const express = require("express");
const morgan = require("morgan");

const planetRouter = require("./src/routes/planets/planets.router");
const launchRouter = require("./src/routes/launch/launch.router");

const app = express();

//We use morgan to log our requests.
app.use(morgan("combined"));

app.use(express.json());

app.use("/planets", planetRouter);
app.use("/launches", launchRouter);

module.exports = app;
