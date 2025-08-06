const { errorHandler } = require("../utils/error");
const bcrypt = require("bcryptjs");
const { userModel } = require("../models/user.model");
const { Listing } = require("../models/listing.model");

async function updateUser(req, res, next) {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    //updated user
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...restInfo } = updatedUser._doc;

    res.status(201).json({
      success: true,
      message: "User updated sucessfully",
      user: restInfo,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  if (req.user.id !== req.params.id)
    return next(errorHandler(400, "You can only delete your own account"));
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.clearCookie("token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
}

async function getuserListings(req, res, next) {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(201).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings"));
  }
}

async function getUser(req, res, next) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...restInfo } = user._doc;
    res.status(200).json(restInfo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getuserListings,
  getUser,
};
