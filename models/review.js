const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    author: String,
    body: String,
    rating: Number,
});

module.exports = mongoose.model("Review", ReviewSchema);
