const express = require('express');
const router  = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const listingControllers = require('../controllers/listings');

// Show listing — PUBLIC (anyone can view a listing)
router.get('/', wrapAsync(listingControllers.getShowPage));

// Edit form — protected
router.get('/edit', isLoggedIn, wrapAsync(listingControllers.getEditRender));

module.exports = router;
