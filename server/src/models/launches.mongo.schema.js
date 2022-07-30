const mongooese = require("mongoose");

const launchSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  missionName: {
    type: String,
    required: true,
  },
  launchData: {
    type: Date,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    ref: String,
    required: true,
  },
  abort: {
    type: Boolean,
    required: true,
    default: true,
  },
  customers: [String],
});

//Connects launchSchema with the "launches" colection
model.exports = mongooese.model("Launch", launchSchema);
