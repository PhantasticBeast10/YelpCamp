const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");

const Campground = require("./models/campground");
const catchAsync = require("./utilities/catchAsync");
const campgroundValidationSchema = require("./validationSchemas");

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});

const validateCampground = (req, res, next) => {
    const { error } = campgroundValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((d) => d.message).join("\n");
        throw new ExpressError(400, msg);
    } else {
        next()
    }
};

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get(
    "/campgrounds",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find();
        res.render("campgrounds/index", { campgrounds });
    })
);

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.get(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/show", { campground });
    })
);

app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", { campground });
    })
);

app.post(
    "/campgrounds/new",
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = req.body.campground;
        const newCampground = new Campground(campground);
        await newCampground.save();
        res.redirect(`/campgrounds/${newCampground._id}`);
    })
);

app.patch(
    "/campgrounds/:id",
    validateCampground,
    catchAsync(async (req, res) => {
        const updatedCampground = { ...req.body.campground };
        await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
        res.redirect(`/campgrounds/${req.params.id}`);
    })
);

app.delete(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect("/campgrounds");
    })
);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { errCode = 500 } = err;
    if (!err.msg) err.msg = "Kuch gadbad hui hain!";
    res.status(errCode).render("error", { err });
});

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080...");
});
