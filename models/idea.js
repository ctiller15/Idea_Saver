var mongoose = require('mongoose');

var ideaSchema = mongoose.Schema({
	title: String,
	category: String,
	text: String
});

var Idea = mongoose.model('Idea', ideaSchema);

module.exports = {Idea}