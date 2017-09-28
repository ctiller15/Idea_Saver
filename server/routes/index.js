var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require('../../models/user.js');

// Index

router.get('/', (req, res) => {
	res.render('home.hbs');
});
// ============
// AUTH routes
// ============
// show sign up form
router.get("/register", (req, res) => {
	res.render('register.hbs');
});

// handle user sign up
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser , req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("./register");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/ideas");
		});
	});
});

// LOGIN routes
// render login form
router.get("/login", (req, res) => {
	res.render('login.hbs');
});

// Login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/ideas",
	failureRedirect: "/login"
}), (req, res) => {
	// nothing to see here!
});

// logout route
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router