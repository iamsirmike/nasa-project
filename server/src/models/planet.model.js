const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planet.mongo.schema");

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_prad"] < 1.6 &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] <= 1.11
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", (data) => {
        if (isHabitable(data)) {
          savePlanetData(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const habitablePlanets = (await getAllPlanets()).length;
        console.log(`We found ${habitablePlanets} habitable planets!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, {
    '_id': 0,
    "__v": 0
  });
}

async function savePlanetData(planet) {
  try {
    return await planets.updateOne(
      {
        planetName: planet.kepler_name,
      },
      {
        planetName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not insert data ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
