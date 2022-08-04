const axios = require("axios");
const launchesDb = require("./launches.mongo.schema");
const planets = require("./planet.mongo.schema");

const DEAFAULT_FLIGHT_NUMBER = 1;

const exludeMongoDefaultFields = {
  __v: 0,
  _id: 0,
};

//lINK TO SPACEX endpoint
const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query";

//Make call to SpaceX endpoint to fetch launches
async function loadSpaceXLanuchesData() {
  //As a way to minimize hitting the enpoint we check if this data is in the database
  //If it in the databse we assume that we have already saved the data so we return
  const isAvailable = await CheckIfDataExist({
    flightNumber: 87,
    missionName: "Starlink-2",
    rocket: "Falcon 9",
  });

  if (isAvailable) {
    console.log("Data already loaded!");
    return;
  }

  //Make the call using axios
  const response = await axios.post(SPACE_X_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Error downloading spaceX data");
    throw new Error("failed to download");
  }

  const launchDocs = response.data.docs;

  //loop over the data(body) we got from the endpoint and map the values to match our luanchschema
  for (const launchDoc of launchDocs) {
    //This [payloads] contains a list of customers
    const payload = launchDoc["payloads"];
    const customers = payload.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      missionName: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["dte_local"],
      upcoming: launchDoc["upcoming"],
      sucess: launchDoc["success"],
      customers: customers,
    };
    console.log(`${launch.flightNumber} ${launch.missionName}`);

    addLaunch(launch);
  }
}

async function getLatestFlightNumber() {
  //We sort the the list by flightNumber and arrange den in asscending order
  //This makes we get the latest flightNumber which is the highest
  const latestLaunch = await launchesDb.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEAFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

//Get all launches and paginate
async function getAllLaunches(skip, limit) {
  return await launchesDb
    .find({}, exludeMongoDefaultFields)
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function addLaunch(launch) {
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

async function CheckIfDataExist(filter) {
  return await launchesDb.findOne(filter);
}

//Check if a document with the flightNumber exist in the collection
async function islaunchAvailable(flightNumber) {
  const launch = await CheckIfDataExist({
    flightNumber: flightNumber,
  });
  return launch;
}

async function scheduleNewLaunch(launch) {
  //Check to see if the target name exist in the planets collection
  //This is like foreign key
  const planet = await planets.findOne({
    planetName: launch.target,
  });

  //If it doesn't exist throw an error
  if (!planet) throw new Error("No matching planet found");
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
  loadSpaceXLanuchesData,
  getAllLaunches,
  islaunchAvailable,
  scheduleNewLaunch,
  abortLaunch,
};
