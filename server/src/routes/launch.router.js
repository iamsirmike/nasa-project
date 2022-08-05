const express = require("express");
const auth = require("../../middlewares/auth.middleware");

const {
  httpGetLaunches,
  httpScheduleLaunch,
  httpDeleteLaunch,
} = require("../controllers/launch.controller");

const launchRouter = express.Router();

launchRouter.get("/", auth, httpGetLaunches);
launchRouter.post("/", auth, httpScheduleLaunch);
launchRouter.delete("/:flightNumber", auth, httpDeleteLaunch);

module.exports = launchRouter;
