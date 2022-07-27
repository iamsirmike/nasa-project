//Create our server using http and pass app to it.
//App is coming from app.js which is our express app.
//We now use express as a middleware to handle our requests.

const http = require("http");

const app = require("./app");
const { loadPlanetsData } = require("./src/models/planet.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
