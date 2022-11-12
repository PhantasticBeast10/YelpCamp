const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

const Campground = require("../models/campground");
const Review = require("../models/review");

const { reviewValidationSchema } = require("../validationSchemas");

const validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((d) => d.message).join("\n");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.campId);
        const review = req.body.review;
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
