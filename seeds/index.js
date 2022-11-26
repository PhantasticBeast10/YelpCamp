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
        const price = Math.ceil(Math.random() * 200);
        const c = new Campground({
            owner: "637099946b0b32f7d6d94356",
            title: `${random(descriptors)} ${random(places)}`,
            image: "https://source.unsplash.com/collection/483251/200x200",
            location: `${random(cities).city}, ${random(cities).state}`,
            description: "blah blah blah blah",
            price,
        });
        await c.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
