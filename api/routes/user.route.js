const express = require("express");
const {
  updateUser,
  deleteUser,
  getuserListings,
  getUser,
} = require("../controllers/user.controller");
const { verifyUser } = require("../utils/verifyUser");

const userRouter = express.Router();

userRouter.put("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);
userRouter.get("/listings/:id", verifyUser, getuserListings);
userRouter.get("/:id", verifyUser, getUser);
module.exports = {
  userRouter,
};
