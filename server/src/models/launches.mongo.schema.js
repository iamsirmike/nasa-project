const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  missionName: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    ref: String,
  },
  abort: {
    type: Boolean,
    required: false,
    default: true,
  },
  sucess: {
    type: Boolean,
    required: true,
    default: true,
  },
  customers: [String],
});

//Connects launchSchema with the "launches" colection
module.exports = mongoose.model("Launch", launchSchema);
