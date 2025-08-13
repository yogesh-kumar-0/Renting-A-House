const express = require('express');
const router = express.Router({mergeParams: true });
const wrapAsync =require('../utils/wrapAsync');
const {isLoggedIn} = require('../middleware');

const listingControllers = require('../controllers/listings');






//show route

router.route('/').get(isLoggedIn, wrapAsync(listingControllers.getShowPage));

// router.get('/',isLoggedIn, wrapAsync(listingControllers.getShowPage));


//create post add new

//edit route
router.get('/edit',isLoggedIn,wrapAsync(listingControllers.getEditRender));


module.exports = router;
