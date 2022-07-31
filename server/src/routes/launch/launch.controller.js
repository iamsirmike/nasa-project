const {
  getAllLaunches,
  scheduleNewLaunch,
  islaunchAvailable,
  abortLaunch,
} = require("./../../models/launch.model");

async function httpGetLaunches(req, res) {
  res.status(200).json(await getAllLaunches());
}

async function httpScheduleLaunch(req, res) {
  const launch = req.body;

  if (
    !req.body.missionName ||
    !req.body.launchDate ||
    !req.body.rocket ||
    !req.body.target
  ) {
    return res.status(400).json({
      error: "Invalid data",
    });
  }

  //convert and make sure date is correct
  launch.launchDate = new Date(launch.launchDate);
  await scheduleNewLaunch(launch);

  res.status(200).json(launch);
}

async function httpDeleteLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);
  const launchExist = await islaunchAvailable(flightNumber);
  if (!launchExist) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  const editedLaunch = await abortLaunch(flightNumber);

  if (!editedLaunch) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  res.status(200).json({
    ok: "Mission aborted successfuly",
  });
}

module.exports = {
  httpGetLaunches,
  httpScheduleLaunch,
  httpDeleteLaunch,
};
