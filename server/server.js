// Libraries

const methodOverride = require('method-override');
const express = require('express');
const {mongoose} = require('../db/mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const hbs = require('hbs');
const groupBy = require('handlebars-group-by');

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
// Required for flash messaging
app.use(flash());

// Using our bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ======================
// PASSPORT CONFIGURATION
// ======================
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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// grabbing the public directory for use.
app.use(express.static("public"));

//HBS helper
hbs.registerHelper(groupBy(hbs));

hbs.registerHelper('spaceRemove', function(str){
	str = str.replace(/\s/g, '');
	return str;
});
// hbs.registerHelper('test', function(obj, options){
// 	var cats = [];
// 	var sortedIdeas = {};
// 	var ret = {};
// 	// Collect a list of all categories.
// 	for(variable in obj){
// 		if(cats.indexOf(obj[variable].category) === -1){
// 			cats.push(obj[variable].category);
// 			sortedIdeas[obj[variable].category] = [];		
// 		}
// 	}
// 	// return JSON.stringify(sortedIdeas);

// 	cats.forEach(function(category){
// 		for(variable in obj){
// 			if(category === obj[variable].category){
// 				sortedIdeas[category].push(obj[variable]);
// 			}
// 		}
// 	});
// 	for(var i = 0; i < sortedIdeas.length; i++){
// 		ret = ret + sortedIdeas[i];
// 	}
// 	return JSON.stringify(sortedIdeas);
// 	// return options.fn(JSON.stringify(sortedIdeas));

// });

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