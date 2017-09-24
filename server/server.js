// Libraries

const express = require('express');
const {mongoose} = require('../db/mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const hbs = require('hbs');

// Schemas and functions
var ObjectID = require('mongodb').ObjectID;
const {Idea} = require('../models/idea.js');
// Why does this work?
const User = require('../models/user.js');

const app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + './../views/partials');

// Using our bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Getting passport together.
app.use(require('express-session')({
	secret: 'Stanley is quiet and Golden is energetic',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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
	res.render('home.hbs');
});

// AUTH routes
// show sign up form
app.get("/register", (req, res) => {
	res.render('register.hbs');
});

// handle user sign up
app.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}) , req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("/register");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/ideas");
		});
	});
});

// LOGIN routes
// render login form
app.get("/login", (req, res) => {
	res.render('login.hbs');
});

// Login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/ideas",
	failureRedirect: "/login"
}), (req, res) => {
	// nothing to see here!
});

// logout
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
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

function checkAuthentication(req, res, next){
	if(req.isAuthenticated()){
		// If user is logged in, returns true.
		return next();
	} else{
		res.redirect("/login");
	}
}

app.listen(3000, function() {
	console.log('listening on 3000')
});