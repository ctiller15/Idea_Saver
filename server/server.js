// Libraries

const methodOverride = require('method-override');
const express = require('express');
const {mongoose} = require('../db/mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const hbs = require('hbs');

// Routes
var indexRoutes = require('./routes/index.js');
var ideaRoutes = require('./routes/ideas.js');

// Schemas and functions
var ObjectID = require('../db/mongoose').Types.ObjectId
const {Idea} = require('../models/idea.js');
// Why does this work?
const User = require('../models/user.js');

const app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + './../views/partials');
// Required to do PUT and DELETE requests.
app.use(methodOverride('_method'));

// Using our bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// PASSPORT CONFIGURATION
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

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// grabbing the public directory for use.
app.use(express.static(__dirname + "./../public"));

// ======================
// =====INDEX ROUTES=====
// ======================
app.use('/', indexRoutes);

// ======================
// =====IDEAS ROUTES=====
// ======================
app.use('/ideas', ideaRoutes);

app.listen(3000, function() {
	console.log('listening on 3000')
});