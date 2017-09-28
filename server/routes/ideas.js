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

// List all ideas

router.get('/', checkAuthentication, (req, res) => {
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

router.get('/new', checkAuthentication, (req,res) => {
	res.render('new_idea.hbs');
});

// Create a new idea, then redirect.

router.post('/', checkAuthentication, (req, res) => {	
	CRUD.createIdeas(req);
	res.redirect('/ideas/');
});

// Show info about one idea.

router.get('/:id', checkAuthorization, (req, res) => {
	CRUD.readIdeas(req.params.id, req, res);
	// res.send("This is the info on ONE idea.");
});

// Edit form for one idea.
router.get('/:id/edit', checkAuthorization, (req, res) => {
	res.render("edit.hbs", {ideaID: req.params.id});
});

// Update one idea.
router.put('/:id', checkAuthorization, (req, res) => {
	CRUD.updateIdeas(req.body, req.params.id);
	res.redirect('/ideas');
});

// Delete the idea.
router.delete('/:id', checkAuthorization, (req, res) => {
	CRUD.destroyIdeas(req.params.id);
	res.redirect('/ideas');
});

function checkAuthentication(req, res, next){
	if(req.isAuthenticated()){
		// If user is logged in, returns true.
		return next();
	} else{
		res.redirect("/login");
	}
}

function checkAuthorization(req, res, next){
	// is user logged in
	if(req.isAuthenticated()){
		// reading a document
		Idea.findOne({ "_id" : new ObjectID(req.params.id)}).then((idea) => {
			if(idea){
				// does user own idea?
				if(idea.author.id.equals(req.user._id)){
					next();
				} else {
					console.log("Not authorized!");
					res.redirect("back");
				}

			} else if (!idea){
				console.log("idea not found");
				res.redirect("back");
			}
			}, (err) => {
				console.log(err);
			});
		} else {
			console.log("Gotta be logged in!");
			res.redirect("back");
		}
	}

module.exports = router