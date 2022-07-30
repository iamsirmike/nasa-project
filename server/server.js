//Create our server using http and pass app to it.
//App is coming from app.js which is our express app.
//We now use express as a middleware to handle our requests.

const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanetsData } = require("./src/models/planet.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://iamsirmike:ccVuIFJULOIzdKIK@nasacluster.q3zeynj.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("Mongo connection is ready!");
});

mongoose.connection.on("err", () => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
