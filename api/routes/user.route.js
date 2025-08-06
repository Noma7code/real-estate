const express = require("express");
const {
  updateUser,
  deleteUser,
  getuserListings,
} = require("../controllers/user.controller");
const { verifyUser } = require("../utils/verifyUser");

const userRouter = express.Router();

userRouter.put("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);
userRouter.get("/listings/:id", verifyUser, getuserListings);
module.exports = {
  userRouter,
};
