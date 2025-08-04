const { cloudinary } = require("../utils/cloudinary");
const { errorHandler } = require("../utils/error");

async function generateSignature(req, res, next) {
  const { folder } = req.body;

  if (!folder) {
    return next(errorHandler(400, "folder name is required"));
  }
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );
    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  generateSignature,
};
