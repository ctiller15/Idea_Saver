const {Idea} = require('../../models/idea.js');
var User = require('../../models/user.js');
var ObjectID = require('../../db/mongoose').Types.ObjectId;

var middlewareObj = {
	checkAuthentication: function(req, res, next){
		if(req.isAuthenticated()){
			// If user is logged in, returns true.
			return next();
		} else{
			req.flash("error", "Please log in first.");
			res.redirect("/login");
		}
	},

	checkAuthorization: function(req, res, next){
		// is user logged in
		if(req.isAuthenticated()){
			// reading a document
			Idea.findOne({ "_id" : new ObjectID(req.params.id)}).then((idea) => {
				if(idea){
					// does user own idea?
					if(idea.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "Not your idea!");
						res.redirect("/");
					}

				} else if (!idea){
					console.log("idea not found");
					req.flash("error", "Idea not found.");
					res.redirect("/ideas");
				}
				}, (err) => {
					console.log(err);
				});
			} else {
				console.log("Gotta be logged in!");
				req.flash("error", "Please log in first.");
				res.redirect("/login");
			}
		}
	}

module.exports = middlewareObj