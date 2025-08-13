const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { userSchema } = require("../schema");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl ,validateUser} = require("../middleware");
const userController = require("../controllers/users");
const user = require("../models/user");

// Render signup page

router.route("/signup")
  .get(userController.renderSignup)
  .post(validateUser, wrapAsync(userController.createUser));

// router.get("/signup",userController.renderSignup);

// router.post('/signup',validateUser,wrapAsync(userController.createUser));

// Render login page

router.route("/login")
  .get(userController.renderLogin)  
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true
  }), userController.loginUser);

// router.get("/login",userController.renderLogin);

// // Handle login
// router.post('/login' ,saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/user/login",failureFlash:true}),
// userController.loginUser);

//logout route
router.get('/logout', isLoggedIn,userController.logoutUser);    



module.exports = router;