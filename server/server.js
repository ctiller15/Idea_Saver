const express = require('express');
const app = express();
var expressMongoDb = require('express-mongo-db');
// var MongoClient = require('mongodb').MongoClient;

// Connecting with express-mongodb
var url = 'mongodb://localhost:27017/idea_saver';
app.use(expressMongoDb(url));;

// // Connecting to server
// MongoClient.connect(url, function(err, db) {
// 	console.log("Connected to server successfully");

// 	db.close();
// });


// CREATE
var createIdeas = function(db, cb){
	var collection = db.collection('ideas');
	// Inserting a document
	collection.insertOne(
		{	
			title: "First Idea",
			text: "This is the very first idea saved to the database!"
		}
	, function(err, result) {
		console.log("Inserted a document into the collection.");
		// console.log(result)
	});
}

// READ
var readIdeas = function(db, cb){
	var collection = db.collection('ideas');
	// reading a document
	collection.findOne(
		{}
	, function(err, result) {
		console.log("Finding a document.");
		console.log(result);
	});
}

// UPDATE
var updateIdeas = function(db, cb){
	var collection = db.collection('ideas');
	// updating a document
	collection.findOneAndUpdate({}
		, {$set: {text: "This text has been updated."}}
		, {returnOriginal: false}
	, function(err, result){
		console.log("updating a document...");
		console.log(result);
	})
}

// DESTROY
var destroyIdeas = function(db, cb){
	var collection = db.collection('ideas');
	// deleting a document.
	collection.findOneAndDelete(
		{}
	, function(err, result) {
		console.log("deleting a document...");
		console.log(result);
	})
}





// Index

app.get('/', (req, res) => {
	res.send("This is the landing page");
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
	createIdeas(req.db);
	res.send("Idea created, redirecting...");
});

// Show info about one idea.

app.get('/ideas/:id', (req, res) => {
	readIdeas(req.db);
	res.send("This is the info on ONE idea.")
});

// Edit form for one idea.
app.get('/ideas/:id/edit', (req, res) => {
	res.send("This is the edit form for one idea.")
});

// Update one idea.
app.put('/ideas/:id', (req, res) => {
	updateIdeas(req.db);
	res.send("This is the update route for one idea.");
});

// Delete the idea.
app.delete('/ideas/:id', (req, res) => {
	destroyIdeas(req.db);
	res.send("This is the delete route for one idea.");
});

app.listen(3000, function() {
	console.log('listening on 3000')
});