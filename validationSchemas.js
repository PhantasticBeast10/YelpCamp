const Joi = require("joi");

const campgroundValidationSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(10).required(),
        image: Joi.string().required(),
    }).required(),
});

const reviewValidationSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
    }).required(),
});

module.exports = { campgroundValidationSchema, reviewValidationSchema };
