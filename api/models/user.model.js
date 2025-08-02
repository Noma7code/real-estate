const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://tse4.mm.bing.net/th/id/OIP.qM8NOVuRx6fQ6aZHqDl8bAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
};
