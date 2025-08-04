const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.route");
const { authRouter } = require("./routes/auth.route");
const imageUploadRouter = require("./routes/imageUpload.route");
const cookieParser = require("cookie-parser");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", imageUploadRouter);

//middleware to handle errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server errror";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
