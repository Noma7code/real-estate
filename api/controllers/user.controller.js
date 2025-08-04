const { errorHandler } = require("../utils/error");
const bcrypt = require("bcryptjs");
const { userModel } = require("../models/user.model");

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

module.exports = {
  updateUser,
  deleteUser,
};
