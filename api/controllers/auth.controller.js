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

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPasword = await bcrypt.compare(password, validUser.password);
    if (!validPasword) return next(errorHandler(401, "Wrong Credentials"));

    //token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //remove psd
    const { password: pass, ...restUserInfo } = validUser._doc;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, ...restUserInfo });
  } catch (error) {
    return next(error);
  }
}

//google

async function google(req, res, next) {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { password: pass, ...restUserInfo } = user._doc;
      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json(restUserInfo);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new userModel({
        username:
          req.body.name.replace(/\s+/g, "").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { password: pass, ...restUserInfo } = newUser._doc;
      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json(restUserInfo);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  signin,
  google,
};
