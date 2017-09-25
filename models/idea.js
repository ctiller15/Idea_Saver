var mongoose = require('mongoose');

var ideaSchema = mongoose.Schema({
	title: String,
	category: String,
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

var Idea = mongoose.model('Idea', ideaSchema);

module.exports = {Idea}