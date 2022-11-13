const express = require("express");
const router = express.Router();

const passport = require("passport");

const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

const User = require("../models/user");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post(
    "/signup",
    catchAsync(async (req, res, next) => {
        try {
            const { username, email, password } = req.body.user;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Successfully Signed In!");
                res.redirect("/campgrounds");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
        keepSessionInfo: true,
    }),
    catchAsync(async (req, res) => {
        req.flash("success", "Welcome Back!");
        const redirectUrl = req.session.returnTo || "/campgrounds";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    })
);

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Buh-Bye!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
