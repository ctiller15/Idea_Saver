// Libraries

const express = require('express');
const {mongoose} = require('../db/mongoose');
const bodyParser = require('body-parser');

// Schemas and functions
var ObjectID = require('mongodb').ObjectID;
const {Idea} = require('../models/idea.js');

const app = express();

// Using our bodyParser
app.use(bodyParser.json());

// CREATE
var createIdeas = function(reqBod, cb){
	// var collection = db.collection('ideas');
	// Inserting a document
	var idea = new Idea({
		title: reqBod.title,
		category: reqBod.category,
		text: reqBod.text
	});

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
var readIdeas = function(id, cb){
	// reading a document
	Idea.findOne({ "_id" : new ObjectID(id)}).then((idea) => {
		if(idea){
			console.log(idea);
		} else if (!idea){
			console.log("idea not found");
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





// Index

app.get('/', (req, res) => {
	res.send("This is the landing page");
});

// AUTH routes
// show sign up form
app.get("/register", (req, res) => {
	res.send("Welcome to the registration page!");
});

// handle user sign up
app.post("/register", (req, res) => {
	res.send("You've officially registered!");
});

// LOGIN routes
// render login form
app.get("/login", (req, res) => {
	res.send("This is the login form!");
});

// Login logic
app.post("/login", (req, res) => {
	res.send("You've logged in!");
});

// logout
app.post("/logout", (req, res) => {
	res.send("You've logged out!");
});

// List all ideas

app.get('/ideas', (req, res) => {
	res.send("This is the ideas page");
});

// Show new idea form.

app.get('/ideas/new', (req,res) => {
	res.send("This is the new ideas form.");
});

// Create a new idea, then redirect.

app.post('/ideas', (req, res) => {	
	createIdeas(req.body);
	res.send("Idea created, redirecting...");
});

// Show info about one idea.

app.get('/ideas/:id', (req, res) => {
	readIdeas(req.params.id);
	res.send("This is the info on ONE idea.");
});

// Edit form for one idea.
app.get('/ideas/:id/edit', (req, res) => {
	res.send("This is the edit form for one idea.");
});

// Update one idea.
app.put('/ideas/:id', (req, res) => {
	updateIdeas(req.body, req.params.id);
	res.send("This is the update route for one idea.");
});

// Delete the idea.
app.delete('/ideas/:id', (req, res) => {
	destroyIdeas(req.params.id);
	res.send("This is the delete route for one idea.");
});

app.listen(3000, function() {
	console.log('listening on 3000')
});