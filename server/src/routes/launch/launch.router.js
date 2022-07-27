const express = require("express");

const {
  httpGetLaunches,
  httpScheduleLaunch,
  httpDeleteLaunch,
} = require("./launch.controller");

const launchRouter = express.Router();

launchRouter.get("/", httpGetLaunches);
launchRouter.post("/", httpScheduleLaunch);
launchRouter.delete("/:flightNumber", httpDeleteLaunch);

module.exports = launchRouter;
