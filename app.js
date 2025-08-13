if(process.env.NODE_ENV!='production') require('dotenv').config();



const express = require("express");
const app = express();
const mongodb = require("mongoose");

const path = require("path");

const method = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listing");

const session=require('express-session');

const MongoStore= require('connect-mongo');
const flash = require('./utils/flash');

app.use(method("_method"));


//passport-local-mongoose
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const dbUrl = process.env.MONGODB_ATLAS_URL;
//mongoose connection
async function main() {
  await mongodb.connect(dbUrl);
}

main()
  .then(() => {
    console.log("successfully connected");
  })
  .catch((err) => console.log(err));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600// 24 hours

});
store.on('error',(err)=>{
  console.log(err);
})
//session options
const sessionOptions = {
  store,
    secret:process.env.SECRET,  
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // Helps prevent XSS or cross scripting attacks 
    }
};

app.use(session(sessionOptions));
app.use(flash());


//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.currPage ='';
//  res.locals.showAddListing = !req.path.startsWith('/listing');    
    res.locals.success =req.flash('success');
    res.locals.error =req.flash('error');
    res.locals.currUser =req.user; // Make current user available in all views
    next();
})
app.use('/listing',(req,res,next)=>{
  res.locals.currPage ='home';
  next();
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const reviewRoutes = require("./routes/review");
const listingsRoutes = require('./routes/listings'); 
const userRoutes = require('./routes/user'); // Assuming you have a user route

app.use('findOneAndDelete', (req, res, next) => {
  res.locals.findOneAndUpdate = true;
  next();
});
// Mount the routers

app.use("/listing", listingRouter);

app.use("/listing/:id/review", reviewRoutes);

app.use("/listings/:id", listingsRoutes); // Include the `id` parameter

app.use("/user", userRoutes); // User routes




//middleware
// app.use('/api',(req,res,next)=>{
//     let {token} = req.query;
//     if(token=='giveaccess') return next();

//     res.send('error access denied');
// })

//routes
app.get('/',(req,res)=>{
  
  res.render('listing/home.ejs');
});



app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
