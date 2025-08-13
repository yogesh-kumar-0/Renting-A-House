const express = require('express');
const router = express.Router();
const wrapAsync =require('../utils/wrapAsync');
const ExpressError =require('../utils/ExpressError');
const {listingschema} = require('../schema');
const {isLoggedIn, isOwner, validateListing} = require('../middleware');
const Listing = require('../models/listing');
const multer = require('multer');
const {storage} = require('../cloudConfig');
const upload = multer({ storage}); // 1MB limit

const listingControllers = require('../controllers/listings');







//get new

router.route('/new').get(isLoggedIn, wrapAsync(listingControllers.getNewRender))
.post(isLoggedIn,validateListing,upload.single('lististing[image]'), wrapAsync(listingControllers.createNewListing));

// router.get('/new',isLoggedIn,wrapAsync(listingControllers.getNewRender));


// router.post('/new',isLoggedIn,validateListing,wrapAsync(listingControllers.createNewListing));



//patch request
router.patch('/:id',isLoggedIn,isOwner,validateListing,upload.single('lististing[image]'),wrapAsync(listingControllers.updateListing));

//delete 
router.delete('/:id/delete',isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing));

router.get('/',isLoggedIn,wrapAsync(listingControllers.getAllListings));

//review post

// router.all('*',(req,res,next)=>{
//     next(new ExpressError(404,'Page not found'));
// });
module.exports = router;