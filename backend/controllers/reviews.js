const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.postReview =async (req,res)=>{
    let {id} =req.params;
    // let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author to the current user
    await newReview.save();

    
    let addReview= await Listing.findByIdAndUpdate(id,{$push:{reviews:newReview}});
    res.json({success:true, message:'Successfully added a new review'});
    console.log(addReview);
    
}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} =req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.json({success:true, message:'Successfully deleted the review'});
}