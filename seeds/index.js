const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const c = new Campground({
            title: `${random(descriptors)} ${random(places)}`,
            location: `${random(cities).city}, ${random(cities).state}`,
        });
        await c.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
