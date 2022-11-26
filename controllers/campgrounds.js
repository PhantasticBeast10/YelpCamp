const Campground = require("../models/campground");

const index = async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
};

const renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!campground) {
        req.flash("error", "Cannot find Campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
};

const renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find Campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

const createCampground = async (req, res, next) => {
    const campground = req.body.campground;
    campground.owner = req.user._id;
    const newCampground = new Campground(campground);
    await newCampground.save();
    req.flash("success", "Successfully created campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
};

const updateCampground = async (req, res) => {
    const updatedCampground = { ...req.body.campground };
    await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${req.params.id}`);
};

const deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
}

module.exports = {
    index,
    renderNewForm,
    showCampground,
    renderEditForm,
    createCampground,
    updateCampground,
    deleteCampground
};
