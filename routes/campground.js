const express = require("express");
const router = express.Router();

const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

const Campground = require("../models/campground");

const { campgroundValidationSchema } = require("../validationSchemas");
const { reset } = require("nodemon");

const validateCampground = (req, res, next) => {
    const { error } = campgroundValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((d) => d.message).join("\n");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find();
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate(
            "reviews"
        );
        if (!campground) {
            req.flash("error", "Cannot find Campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
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
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = req.body.campground;
        const newCampground = new Campground(campground);
        await newCampground.save();
        req.flash("success", "Successfully created campground");
        res.redirect(`/campgrounds/${newCampground._id}`);
    })
);

router.patch(
    "/:id",
    validateCampground,
    catchAsync(async (req, res) => {
        const updatedCampground = { ...req.body.campground };
        await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
        req.flash("success", "Successfully updated campground");
        res.redirect(`/campgrounds/${req.params.id}`);
    })
);

router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully deleted campground");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
