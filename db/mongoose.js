var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/idea_saver');

module.exports = mongoose;