module.exports.isLoggedIn = (req, res, next) => {

    // console.log(req);

    if (!req.isAuthenticated()) {
        req.session.redirectUrl =req.originalUrl;
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear the redirect URL after use
    }
    next();
}

const Listing = require('./models/listing');


module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)) {
            req.flash('error', 'You do not have permission to this listing');
            return res.redirect(`/listings/${id}`);
        }
    next();
}

//reviews
const Review = require('./models/review');

module.exports.isAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)) {
            req.flash('error', 'You do not have permission to review this listing');
            return res.redirect(`/listings/${id}`);
        }
    next();
}

//validation for listing
const { listingschema } = require('./schema');
const ExpressError = require('./utils/ExpressError');


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400,msg);
    } else {
        next();
}};

const { userSchema } = require('./schema');
// Validation for user
module.exports.validateUser =(req,res,next)=>{
    let {error} =userSchema.validate(req.body);
    if(error){
       const msg =error.details.map(el => el.message).join(',');
       req.flash('error',msg);
         return res.redirect('/user/signup');
    }
    else {
        next();
}};    