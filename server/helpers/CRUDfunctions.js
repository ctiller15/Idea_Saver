// libraries/npm modules
const {mongoose} = require('../../db/mongoose');

// models and schemas
var ObjectID = require('../../db/mongoose').Types.ObjectId
const {Idea} = require('../../models/idea.js');
// Why does this work?
const User = require('../../models/user.js');


// CREATE
var createIdeas = function(req, res, cb){
	// var collection = db.collection('ideas');
	// Inserting a document
	// console.log(reqBod);
	var idea = new Idea({
		title: req.body.title,
		category: req.body.category,
		text: req.body.text,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	});

	// Promise isn't too useful without the response object.
	idea.save().then((doc) => {
		console.log(doc);
		req.flash("success", "Successfully saved superb solution");
		res.redirect('/ideas');		
	}, (err) => {
		console.log(err);
		req.flash("error", err);
		res.status(400).redirect("/ideas");
	});

}

// READ
var readIdeas = function(id, req, res, cb){
	// reading a document
	Idea.findOne({ "_id" : new ObjectID(id)}).then((idea) => {
		if(idea){
			console.log(idea);
			res.render("one_idea.hbs", {ideaObj: idea});
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
}

// UPDATE
var updateIdeas = function(req, res){
	// updating a document
	Idea.findOneAndUpdate({ "_id" : new ObjectID(req.params.id) }
		, {$set: 
			{	
				title: req.body.title,
				category: req.body.category,
				text: req.body.text
			}
		}
		, {new: true}
	).then((idea) => {
		console.log(idea);
		req.flash("success", "Successfully updated idea.");
		res.redirect('/ideas');
	}, (err) => {
		console.log(err);
		req.flash('error', err);
		res.redirect('/ideas');
	});
}

// DESTROY
var destroyIdeas = function(req, res){
	// deleting a document.
	Idea.findOneAndRemove(
		{ "_id" : new ObjectID(req.params.id) }
	).then((idea) => {
		console.log(idea);
		req.flash("success", "Successfully deleted idea.");
		res.redirect('/ideas');
	}, (err) => {
		console.log(err);
		req.flash("error", err);
		res.redirect('/ideas');
	});
}

module.exports = {
	createIdeas,
	readIdeas,
	updateIdeas,
	destroyIdeas
}