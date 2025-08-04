const express = require("express");
const { generateSignature } = require("../controllers/sign.upload.controller");

const signUpload = express.Router();

signUpload.post("/sign-upload", generateSignature);

module.exports = {
  signUpload,
};
