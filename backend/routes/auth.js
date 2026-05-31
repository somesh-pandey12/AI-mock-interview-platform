const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        // Successful authentication, redirect home to frontend dashboard.
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
);

// @desc    Get logged in user details
// @route   GET /auth/me
router.get('/me', (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: "Not Authorized" });
    }
});

// @desc    Log user out
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;