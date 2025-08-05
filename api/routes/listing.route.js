const express = require("express");
const { createListing } = require("../controllers/listing.controller");
const { verifyUser } = require("../utils/verifyUser");

const listingRouter = express.Router();

listingRouter.post("/create", verifyUser, createListing);

module.exports = {
  listingRouter,
};
