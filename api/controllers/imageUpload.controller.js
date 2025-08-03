const express = require("express");
const { cloudinary } = require("../utils/cloudinary");

async function imageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during upload.",
    });
  }
}

module.exports = {
  imageUpload,
};
