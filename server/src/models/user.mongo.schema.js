const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
