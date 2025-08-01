const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: "https://www.flaticon.com/free-icon/user_3177440",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
};
