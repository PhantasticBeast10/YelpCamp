const express = require("express");
const router = express.Router();

// const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

const Campground = require("../models/campground");

// const { reset } = require("nodemon");

const {
    isLoggedIn,
    validateCampground,
    verifyOwner,
} = require("../middleware");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find();
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        if (!campground) {
            req.flash("error", "Cannot find Campground!");
            return res.redirect("/campgrounds");
        }
        console.log(campground);
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    verifyOwner,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Cannot find Campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.post(
    "/new",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = req.body.campground;
        campground.owner = req.user._id;
        const newCampground = new Campground(campground);
        await newCampground.save();
        req.flash("success", "Successfully created campground");
        res.redirect(`/campgrounds/${newCampground._id}`);
    })
);

router.patch(
    "/:id",
    isLoggedIn,
    validateCampground,
    verifyOwner,
    catchAsync(async (req, res) => {
        const updatedCampground = { ...req.body.campground };
        await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
        req.flash("success", "Successfully updated campground");
        res.redirect(`/campgrounds/${req.params.id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    verifyOwner,
    catchAsync(async (req, res) => {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully deleted campground");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
