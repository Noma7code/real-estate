const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("../utils/error");

//signup
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

//signin
async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }
    const validUser = await userModel.findOne({ email });

    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPasword = await bcrypt.compare(password, validUser.password);
    if (!validPasword) return next(errorHandler(401), "Wrong Credentials");

    //token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //remove psd
    const { password: pass, ...restUserInfo } = validUser._doc;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: Date.now() + 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(restUserInfo);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  signup,
  signin,
};
