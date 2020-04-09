var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Route route
router.get("/", (req, res) => {
	res.render("landing");
});

// Show register form
router.get("/register", (req, res) => {
	res.render("register", {page: "register"});
});

// Signup logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash("error", err.message);
			return res.redner("register", {error: err.message});
		} 
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp, " + user.username);
			res.redirect("/campgrounds");
		});
  	});
});

// Show login form
router.get("/login", (req, res) => {
	res.render("login", {page: "login"});
});

// Login logic
router.post("/login", passport.authenticate("local", 
	 {
		successRedirect: "/campgrounds",
	 	failureRedirect: "/login"
	 }), (req, res) => {
});

// Logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out.")
	res.redirect("/campgrounds");
});

module.exports = router;