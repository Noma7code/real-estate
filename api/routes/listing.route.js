const express = require("express");
const {
  createListing,
  deleteListing,
  updateListing,
} = require("../controllers/listing.controller");
const { verifyUser } = require("../utils/verifyUser");

const listingRouter = express.Router();

listingRouter.post("/create", verifyUser, createListing);
listingRouter.delete("/delete/:id", verifyUser, deleteListing);
listingRouter.post("/update/:id", verifyUser, updateListing);
module.exports = {
  listingRouter,
};
