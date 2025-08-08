const express = require("express");
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} = require("../controllers/listing.controller");
const { verifyUser } = require("../utils/verifyUser");

const listingRouter = express.Router();

listingRouter.post("/create", verifyUser, createListing);
listingRouter.delete("/delete/:id", verifyUser, deleteListing);
listingRouter.post("/update/:id", verifyUser, updateListing);
listingRouter.get("/getlisting/:id", getListing);
listingRouter.get("/get", getListings);
module.exports = {
  listingRouter,
};
