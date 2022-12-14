const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: String,
    images: [ImageSchema],
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: "Point",
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
}, opts);

CampgroundSchema.virtual("properties.popupText").get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
