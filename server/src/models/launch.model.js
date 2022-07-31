const launchesDb = require("./launches.mongo.schema");
const planets = require("./planet.mongo.schema");

const DEAFAULT_FLIGHT_NUMBER = 1;

const exludeMongoDefaultFields = {
  __v: 0,
  _id: 0,
};

async function getLatestFlightNumber() {
  //We sort the the list by flightNumber and arrange den in asscending order
  //This makes we get the latest flightNumber which is the highest
  const latestLaunch = await launchesDb.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEAFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDb.find({}, exludeMongoDefaultFields);
}

async function addLaunch(launch) {
  //Check to see if the target name exist in the planets collection
  //This is like foreign key
  const planet = await planets.findOne({
    planetName: launch.target,
  });

  //If it doesn't exist throw an error
  if (!planet) throw new Error("No matching planet found");

  try {
    //Insert data into the launches collection
    return await launchesDb.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (error) {
    console.error(error);
  }
}

//Check if a document with the flightNumber exist in the collection
async function islaunchAvailable(flightNumber) {
  const launch = await launchesDb.findOne({
    flightNumber: flightNumber,
  });
  return launch;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  console.log(`flight ${newFlightNumber}`);

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    abort: false,
    success: true,
    customers: ["NASA", "SIRMIKE"],
  });

  await addLaunch(newLaunch);
}

async function abortLaunch(flightNumber) {
  const newLaunch = await launchesDb.updateOne(
    { flightNumber: flightNumber },
    {
      sucess: false,
      abort: true,
    }
  );

  return newLaunch.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  islaunchAvailable,
  scheduleNewLaunch,
  abortLaunch,
};
