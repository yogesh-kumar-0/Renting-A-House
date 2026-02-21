const express = require('express');
const router  = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const listingControllers = require('../controllers/listings');

// ── IMPORTANT: static routes MUST come before /:id param routes ───────

// Get all listings — PUBLIC
router.get('/', wrapAsync(listingControllers.getAllListings));

// New listing form — PROTECTED (must be before /:id or Express matches 'new' as an id)
router.get('/new', isLoggedIn, wrapAsync(listingControllers.getNewRender));

// Create new listing — PROTECTED
router.post('/', isLoggedIn, upload.single('lististing[image]'), validateListing, wrapAsync(listingControllers.createNewListing));

// Show individual listing — PUBLIC
router.get('/:id', wrapAsync(listingControllers.getShowPage));

// Edit listing form — PROTECTED
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingControllers.getEditRender));

// Update listing — PROTECTED
router.patch('/:id', isLoggedIn, isOwner, upload.single('lististing[image]'), validateListing, wrapAsync(listingControllers.updateListing));

// Delete listing — PROTECTED
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

module.exports = router;
