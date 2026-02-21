const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_BOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.getShowPage = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');

  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  res.json({ listing });
};

module.exports.getEditRender = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  const originalUrl = listing.image
    ? listing.image.replace('/upload', '/upload/h_300/w_250')
    : '';
  res.json({ listing, originalUrl });
};

module.exports.getNewRender = async (req, res) => {
  res.json({ message: 'Ready to create new listing' });
};

module.exports.createNewListing = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image is required' });
  }

  const geoResponse = await geocodingClient
    .forwardGeocode({ query: req.body.lististing.location, limit: 1 })
    .send();

  const features = geoResponse.body.features;
  if (!features || features.length === 0) {
    return res.status(400).json({ success: false, message: 'Could not geocode the given location' });
  }

  const newListing = new Listing(req.body.lististing);
  newListing.owner    = req.user._id;
  newListing.image    = req.file.path;
  newListing.geometry = features[0].geometry;
  await newListing.save();

  res.json({ success: true, message: 'Successfully created a new listing', listing: newListing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.lististing) {
    return res.status(400).json({ success: false, message: 'Send valid listing data' });
  }
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.lististing }, { new: true });

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  if (req.file) {
    listing.image = req.file.path;
    await listing.save();
  }
  res.json({ success: true, message: 'Successfully updated the listing', listing });
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, message: 'Successfully deleted the listing' });
};

module.exports.getAllListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.json({ allListings });
};
