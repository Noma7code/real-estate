const { Listing } = require("../models/listing.model");
const { errorHandler } = require("../utils/error");

async function createListing(req, res, next) {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createListing,
};
