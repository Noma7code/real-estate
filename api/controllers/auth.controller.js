const { userModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");

async function signup(req, res, next) {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.json({
        success: false,
        message: "Username ,Email  and password  are required",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, email, password: hashPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  signup,
};
