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
	var ideaObj = {
		ideas: []
	};
	Idea.find({'author.id': req.user._id})
	.then((idea) => {
		ideaObj.ideas = idea;
		res.render("ideas.hbs", {ideaList: ideaObj});
	}, (err) => {
		console.log(err);
		req.flash("error", err);
		res.redirect("/ideas");
	});
});

// Show new idea form.
router.get('/new', middleware.checkAuthentication, (req,res) => {
	res.render('new_idea.hbs');
});

// Create a new idea, then redirect.
router.post('/', middleware.checkAuthentication, (req, res) => {	
	CRUD.createIdeas(req, res);
});

// Show info about one idea.
router.get('/:id', middleware.checkAuthorization, (req, res) => {
	CRUD.readIdeas(req.params.id, req, res);
});

// Edit form for one idea.
router.get('/:id/edit', middleware.checkAuthorization, (req, res) => {
	Idea.findOne({ "_id" : new ObjectID(req.params.id)}).then((idea) => {
		if(idea){
			console.log(idea);
				res.render("edit.hbs", {ideaObj: idea});
		} else if (!idea){
			console.log("idea not found");
			req.flash("error", "idea not found");
			res.redirect("/ideas");
		}
	}, (err) => {
		console.log(err);
		req.flash("error", err);
		res.redirect("/ideas");
	});

});

// Update one idea.
router.put('/:id', middleware.checkAuthorization, (req, res) => {
	CRUD.updateIdeas(req, res);
});

// Delete the idea.
router.delete('/:id', middleware.checkAuthorization, (req, res) => {
	CRUD.destroyIdeas(req, res);
	// req.flash("success", "Successfully deleted idea.");
	// res.redirect('/ideas');
});

module.exports = router