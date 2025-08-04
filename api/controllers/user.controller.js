const { userModel } = require("../models/user.model");
const { errorHandler } = require("../utils/error");
const bcrypt = require("bcryptjs");

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

module.exports = {
  updateUser,
};
