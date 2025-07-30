const { userModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");

async function signup(req, res) {
  const { username, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({ username, email, password });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json("Error", error.message);
  }
}

module.exports = {
  signup,
};
