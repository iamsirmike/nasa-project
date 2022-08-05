const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { findExistingUser, createUser } = require("../models/user.model");

require("dotenv").config();

async function httpCreateUser(req, res) {
  try {
    const body = req.body;

    //validate user input
    if (!(body.userName && body.password)) {
      return res.status(400).send("All input is required");
    }

    const checkIfUserExist = await findExistingUser(body.userName);

    if (checkIfUserExist) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(body.password, 10);

    body.password = encryptedPassword;

    const user = await createUser(body);

    // Create token
    const token = jwt.sign(
      { user_id: user._id, userName: user.userName },
      process.env.JWT_TOKEN,
      {
        expiresIn: "5h",
      }
    );

    user.token = token;

    res.status(201).json({
      userName: user.userName,
      token: user.token,
    });
  } catch (error) {
    console.log(error);
  }
}

async function httpSignIn(req, res) {
  try {
    const body = req.body;

    //validate user input
    if (!(body.userName && body.password)) {
      return res.status(400).send("All inputs are required");
    }

    //chech if a user with the provided username exist
    const user = await findExistingUser(body.userName);

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    //compare passwords
    const validatePassword = await bcrypt.compare(body.password, user.password);

    if (!validatePassword) {
      return res.status(400).send("Invalid username or password");
    }

    // Create token
    const token = jwt.sign(
      { user_id: user._id, userName: user.userName },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    user.token = token;

    res.status(201).json({
      userName: user.userName,
      token: user.token,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getUserDetails(req, res) {
  const authenticatedUser = req.user.userName;

  //validate user input
  if (!authenticatedUser) {
    return res.status(400).send("You are not authorized to see this info");
  }
  const user = await findExistingUser(authenticatedUser);
  if (!user) {
    return res.status(401).send("User not found");
  }

  res.status(201).json({
    userName: user.userName,
  });
}

module.exports = {
  httpCreateUser,
  httpSignIn,
  getUserDetails,
};
