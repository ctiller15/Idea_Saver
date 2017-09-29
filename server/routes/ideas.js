// importing libraries
var express = require("express");
var router = express.Router();
var passport = require("passport");

// importing models
const {Idea} = require('../../models/idea.js');
var User = require('../../models/user.js');

// importing functions
var ObjectID = require('../../db/mongoose').Types.ObjectId;
var CRUD = require('../helpers/CRUDfunctions.js');
var middleware = require('../helpers/middleware.js');

// List all ideas
router.get('/', middleware.checkAuthentication, (req, res) => {
	console.log(req.user);
	var ideaObj = {
		ideas: []
	};
	Idea.find({'author.id': req.user._id})
	.then((idea) => {
		console.log(ideaObj);
		console.log("Success!");
		ideaObj.ideas = idea;
		console.log(ideaObj);
		res.render("ideas.hbs", {ideaList: ideaObj});
	}, (err) => {
		console.log(err);
		console.log("Failed!");
		res.send("Failure!");
	});
	// console.log(ideaObj);
	// //console.log(ideaObj.ideaList);
	// // res.render('ideas.hbs', {currentUser: req.user, ideaList: ideaObj.ideaList});
	// res.render("ideas.hbs", {ideaList: "Words!"});
});

// Show new idea form.
router.get('/new', middleware.checkAuthentication, (req,res) => {
	res.render('new_idea.hbs');
});

// Create a new idea, then redirect.
router.post('/', middleware.checkAuthentication, (req, res) => {	
	CRUD.createIdeas(req);
	req.flash("success", "Successfully saved superb solution");
	res.redirect('/ideas/');
});

// Show info about one idea.
router.get('/:id', middleware.checkAuthorization, (req, res) => {
	CRUD.readIdeas(req.params.id, req, res);
	// res.send("This is the info on ONE idea.");
});

// Edit form for one idea.
router.get('/:id/edit', middleware.checkAuthorization, (req, res) => {
	res.render("edit.hbs", {ideaID: req.params.id});
});

// Update one idea.
router.put('/:id', middleware.checkAuthorization, (req, res) => {
	CRUD.updateIdeas(req.body, req.params.id);
	req.flash("success", "Successfully updated idea.");
	res.redirect('/ideas');
});

// Delete the idea.
router.delete('/:id', middleware.checkAuthorization, (req, res) => {
	CRUD.destroyIdeas(req.params.id);
	req.flash("success", "Successfully deleted idea.");
	res.redirect('/ideas');
});

module.exports = router