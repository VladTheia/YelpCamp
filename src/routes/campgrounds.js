const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const middleware = require('../middleware')

// INDEX - show all campgrounds
router.get('/', (req, res) => {

    // Get all campgrounds from the db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds})
        }
    })
})

// CREATE - add new campgrounds to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    const name = req.body.name
    const price = req.body.price
    const image = req.body.image
    const desc = req.body.description
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, price: price, image: image, description: desc, author: author}
    // Create new campground and add to db
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect('/campgrounds')
        }
    })
})

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
    // find the campground with that id and render it's page
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render the show template with that campgound
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
})

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground})
    })
})

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router