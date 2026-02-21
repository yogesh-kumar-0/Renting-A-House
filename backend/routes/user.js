const express = require('express');
const router  = express.Router();
const passport = require('passport');
const { isLoggedIn, saveRedirectUrl, validateUser } = require('../middleware');
const userController = require('../controllers/users');

// ── PUBLIC ────────────────────────────────────────────────────────────

// Auth status — always 200, no guard
router.get('/auth-status', (req, res) => {
  return res.status(200).json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

// Current user — returns 401 if not logged in (used by frontend)
router.get('/current', (req, res) => {
  if (req.isAuthenticated()) return res.json({ user: req.user });
  return res.status(401).json({ message: 'Not authenticated' });
});

// Signup
router.route('/signup')
  .get(userController.renderSignup)
  .post(validateUser, userController.createUser);

// Login
router.route('/login')
  .get(userController.renderLogin)
  .post(saveRedirectUrl, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || 'Invalid username or password',
        });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return userController.loginUser(req, res);
      });
    })(req, res, next);
  });

// ── PROTECTED ─────────────────────────────────────────────────────────

// Logout
router.get('/logout', isLoggedIn, userController.logoutUser);

// Profile
router.get('/profile',             isLoggedIn, userController.getUserProfile);
router.put('/profile',             isLoggedIn, userController.updateUserProfile);
router.put('/profile/username',    isLoggedIn, userController.changeUsername);
router.put('/profile/password',    isLoggedIn, userController.changePassword);

module.exports = router;
