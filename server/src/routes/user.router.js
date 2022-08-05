const express = require("express");

const {
  httpCreateUser,
  httpSignIn,
  getUserDetails,
} = require("../controllers/user.controller");
const auth = require("../../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post("/createUser", httpCreateUser);
userRouter.post("/signin", httpSignIn);
userRouter.get("/details", auth, getUserDetails);

module.exports = userRouter;
