const express = require("express");
const { updateUser } = require("../controllers/user.controller");
const { verifyUser } = require("../utils/verifyUser");

const userRouter = express.Router();

userRouter.put("/update/:id", verifyUser, updateUser);

module.exports = {
  userRouter,
};
