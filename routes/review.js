const express = require("express");
const router = express.Router({ mergeParams: true });

// const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

const Campground = require("../models/campground");
const Review = require("../models/review");

const { isLoggedIn, validateReview, verifyAuthor } = require("../middleware");

router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.campId);
        const review = req.body.review;
        review.author = req.user._id;
        const newReview = new Review(review);
        campground.reviews.push(newReview);
        await newReview.save();
        await campground.save();
        req.flash("success", "Successfully added review");
        res.redirect("/campgrounds/" + req.params.campId);
    })
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    verifyAuthor,
    catchAsync(async (req, res) => {
        const { campId, reviewId } = req.params;
        const campground = await Campground.findById(campId);
        campground.reviews.filter((review) => review.id !== reviewId);
        await Review.findByIdAndDelete(reviewId);
        await campground.save();
        req.flash("success", "Successfully deleted review");
        res.redirect("/campgrounds/" + campId);
    })
);

module.exports = router;
