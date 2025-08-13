const User = require("../models/user");



module.exports.renderSignup =  (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.createUser = async (req, res) => {
    let { username, password ,email} = req.body.user;
    const newUser =new User({username,email});
    const registeredUser= await User.register(newUser,password);
    req.login(registeredUser, (err) =>{
        if (err) {
            return next(err);
        }   
         req.flash('success', 'Successfully signed up');
       return res.redirect('/listing');
    });
    console.log(registeredUser);
    // Automatically log in the user after registration
};


module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginUser = async(req, res) => {
    req.flash('success', `successfully logged in ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || '/listing');
};


module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/user/login');
    })};
