const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
  planetName: {
    type: String,
    required: true,
  },
});

//Connects planetSchema with the "planets" colection
module.exports = mongoose.model("Planet", planetSchema);
