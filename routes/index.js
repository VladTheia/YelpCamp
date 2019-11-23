const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

// Root route
router.get('/', (req, res) => {
    res.render('landing')
})

// ===========
// AUTH ROUTES
// ===========

// Show register form route
router.get('/register', (req, res) => {
    res.render('register')
})

// Handle sign up route
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render('register', {'error': err.message})
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', "Welcome to YelpCamp" + user.username)
            res.redirect('/campgrounds')
        })
    })
})

// Show login form
router.get('/login', (req, res) => {
    res.render('login')
})

// Handle login route
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
})

// Logout route
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds')
})

module.exports = router