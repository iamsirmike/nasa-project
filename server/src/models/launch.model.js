const launches = new Map();

let latestFlightNumber = 1;

const launch = {
  flight_number: 1,
  mission_name: "We move 1",
  launch_date: new Date("2020-01-01"),
  rocket_type: "FalconSat",
  planet_name: "Kepler-1652 b",
  launch_success: true,
  customers: ["name", "NASA"],
};

launches.set(launch.flight_number, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function islaunchAvailable(flightNumber) {
  return launches.has(flightNumber);
}

function scheduleLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flight_number: latestFlightNumber,
      launch_success: true,
      customers: ["Zero to mastery", "NASA"],
    })
  );
}

function deleteLaunch(flightNumber) {
  const launch = launches.get(flightNumber);
  if (launch) {
    launch.launch_success = false;
  }

  return launch;
}

module.exports = {
  getAllLaunches,
  islaunchAvailable,
  scheduleLaunch,
  deleteLaunch,
};
