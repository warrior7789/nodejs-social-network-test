const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
// Register route
router.get('/register', (req, res) => {
    res.render('register.ejs');
});
router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register.ejs');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/profile');
        });
    });
});
// Login route
router.get('/login', (req, res) => {
    res.render('login.ejs');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
}), (req, res) => {});
// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
// Profile route
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs');
});
// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;