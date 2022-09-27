const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

app.post("/campgrounds/new", async (req, res) => {
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
});

app.put("/campgrounds/:id", async (req, res) => {
    const updatedCampground = { ...req.body.campground };
    await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
    res.redirect(`/campgrounds/${req.params.id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
});

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080...");
});
