const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
// var expressMongoDb = require('express-mongo-db');
var ObjectID = require('mongodb').ObjectID;
// var MongoClient = require('mongodb').MongoClient;

const app = express();

// Connecting with express-mongodb
// var url = 'mongodb://localhost:27017/idea_saver';
// app.use(expressMongoDb(url));;

// Using our bodyParser
app.use(bodyParser.json());

// // Connecting to server
// MongoClient.connect(url, function(err, db) {
// 	console.log("Connected to server successfully");

// 	db.close();
// });

mongoose.connect('mongodb://localhost:27017/idea_saver');

var ideaSchema = mongoose.Schema({
	title: String,
	category: String,
	text: String
});

var Idea = mongoose.model('Idea', ideaSchema);


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
	// collection.insertOne(
	// 	{	
	// 		title: reqBod.title,
	// 		text: reqBod.text
	// 	}
	// , function(err, result) {
	// 	console.log("Inserted a document into the collection.");
	// 	console.log(result.ops);
	// });
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
	// collection.findOne(
	// 	{ "_id" : new ObjectID(id)}, function(err, doc) {
	// 		console.log(doc);
	// 		}
	// );
}

// Using find() instead of findOne()
// // READ
// var readIdeas = function(db, id, cb){
// 	var collection = db.collection('ideas');
// 	// reading a document
// 	collection.find(
// 		{ "_id" : new ObjectID("59c32af6e57db37185fc4f1d")})
// 		.toArray(function(err, docs) {
// 			console.log(docs);
// 	});
// }

// UPDATE
var updateIdeas = function(db, reqBod, id, cb){
	var collection = db.collection('ideas');
	// updating a document
	collection.findOneAndUpdate({ "_id" : new ObjectID(id) }
		, {$set: 
			{	
				title: reqBod.title,
				text: reqBod.text
			}
		}
		, {returnOriginal: false}
	, function(err, result){
		console.log("updating a document...");
		console.log(result.value);
	})
}

// DESTROY
var destroyIdeas = function(db, id, cb){
	var collection = db.collection('ideas');
	// deleting a document.
	collection.findOneAndDelete(
		{ "_id" : new ObjectID(id) }
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
	updateIdeas(req.db, req.body, req.params.id);
	res.send("This is the update route for one idea.");
});

// Delete the idea.
app.delete('/ideas/:id', (req, res) => {
	destroyIdeas(req.db, req.params.id);
	res.send("This is the delete route for one idea.");
});

app.listen(3000, function() {
	console.log('listening on 3000')
});