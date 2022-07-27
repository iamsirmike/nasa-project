const {
  getAllLaunches,
  scheduleLaunch,
  islaunchAvailable,
  deleteLaunch,
} = require("./../../models/launch.model");

function httpGetLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function httpScheduleLaunch(req, res) {
  const launch = req.body;

  if (
    !req.body.mission_name ||
    !req.body.launch_date ||
    !req.body.rocket_type ||
    !req.body.planet_name
  ) {
    return res.status(400).json({
      error: "Invalid data",
    });
  }

  launch.launnch_date = new Date(launch.launch_date);
  scheduleLaunch(req.body);

  res.status(200).json(launch);
}

function httpDeleteLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);
  if (!islaunchAvailable(flightNumber)) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  const editedLaunch = deleteLaunch(flightNumber);
  res.status(200).json(editedLaunch);
}

module.exports = {
  httpGetLaunches,
  httpScheduleLaunch,
  httpDeleteLaunch,
};
