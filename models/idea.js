var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/idea_saver');

var ideaSchema = mongoose.Schema({
	title: String,
	category: String,
	text: String
});

var Idea = mongoose.model('Idea', ideaSchema);

module.exports = {Idea}