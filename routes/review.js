const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync =require('../utils/wrapAsync');
const ExpressError =require('../utils/ExpressError');

const {reviewSchema} =require('../schema');
const Listing = require('../models/listing');
const Review = require('../models/review');
const {isLoggedIn,isAuthor} = require('../middleware');

const reviewController = require('../controllers/reviews');

//validation for review
const validationReview = (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400,msg);
    } else {
        next();
    }
};

//post review

router.post('/',isLoggedIn,validationReview,wrapAsync(reviewController.postReview));

//delete review
router.delete('/:reviewId',isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));


module.exports = router;