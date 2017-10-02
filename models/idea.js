var mongoose = require('mongoose');

var ideaSchema = mongoose.Schema({
	title: {type: String,
			maxlength: 100,
			required: true,
			trim: true
		},
	category: {
			type: String,
			maxlength: 100,
			required: true,
			lowercase: true,
			trim: true
		},
	text: {type: String,
			maxlength: 2000,
			required: true,
			trim: true
		},
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