const express = require('express');
const app = express();
var MongoClient = require('mongodb')

var url = 'mongodb://localhost:27017/idea_saver';

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
	res.send("Idea created, redirecting...");
});

// Show info about one idea.

app.get('/ideas/:id', (req, res) => {
	res.send("This is the info on ONE idea.")
});

// Edit form for one idea.
app.get('/ideas/:id/edit', (req, res) => {
	res.send("This is the edit form for one idea.")
});

// Update one idea.
app.put('/ideas/:id', (req, res) => {
	res.send("This is the update route for one idea.");
});

// Delete the idea.
app.delete('/ideas/:id', (req, res) => {
	res.send("This is the delete route for one idea.");
});

app.listen(3000, function() {
	console.log('listening on 3000')
});