const express = require("express");
const { imageUpload } = require("../controllers/imageUpload.controller");
const { multerUpload } = require("../middlewares/multer");

const imageUploadRouter = express.Router();
imageUploadRouter.post(
  "/image-upload",
  multerUpload.single("image"),
  imageUpload
);

module.exports = imageUploadRouter;
