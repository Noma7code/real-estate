const express = require("express");
const { imageUpload } = require("../controllers/image.upload.controller");

const imageUploadRouter = express.Router();
imageUploadRouter.post("/image-upload", imageUpload);

module.exports = imageUploadRouter;
