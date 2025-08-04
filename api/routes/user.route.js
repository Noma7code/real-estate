const express = require("express");
const { updateUser, deleteUser } = require("../controllers/user.controller");
const { verifyUser } = require("../utils/verifyUser");

const userRouter = express.Router();

userRouter.put("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);

module.exports = {
  userRouter,
};
