const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.route");
const { authRouter } = require("./routes/auth.route");
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

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
