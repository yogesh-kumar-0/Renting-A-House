const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.postReview =async (req,res)=>{
    let {id} =req.params;
    // let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author to the current user
    await newReview.save();


    
    let addReview= await Listing.findByIdAndUpdate(id,{$push:{reviews:newReview}});
    req.flash('success','Successfully added a new review');
    res.redirect(`/listings/${id}`);
    console.log(addReview);
    
}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} =req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review');
    res.redirect(`/listings/${id}`);
}