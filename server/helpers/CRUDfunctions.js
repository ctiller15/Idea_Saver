// libraries/npm modules
const {mongoose} = require('../../db/mongoose');

// models and schemas
var ObjectID = require('../../db/mongoose').Types.ObjectId
const {Idea} = require('../../models/idea.js');
// Why does this work?
const User = require('../../models/user.js');


// CREATE
var createIdeas = function(req, cb){
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
	// idea.author.push({
	// 	id: req.user._id
	// });
	console.log(idea);
	// console.log(reqBod.user._id);

	// Promise isn't too useful without the response object.
	idea.save().then((doc) => {
		console.log(doc);
		res.send(doc);
	}, (err) => {
		console.log(err);
		res.status(400).send(err);
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
			res.redirect("/ideas");
		}
	}, (err) => {
		console.log(err);
	});
}

// UPDATE
var updateIdeas = function(reqBod, id, cb){
	// updating a document
	Idea.findOneAndUpdate({ "_id" : new ObjectID(id) }
		, {$set: 
			{	
				title: reqBod.title,
				category: reqBod.category,
				text: reqBod.text
			}
		}
		, {new: true}
	).then((idea) => {
		console.log(idea);
	}, (err) => {
		console.log(err);
	});
}

// DESTROY
var destroyIdeas = function(id, cb){
	// deleting a document.
	Idea.findOneAndRemove(
		{ "_id" : new ObjectID(id) }
	).then((idea) => {
		console.log(idea);
	}, (err) => {
		console.log(err);
	});
}

module.exports = {
	createIdeas,
	readIdeas,
	updateIdeas,
	destroyIdeas
}