var mongoose     = require('mongoose');

	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		username: { type: String, required: true },
		uid: { type: String, required: true }
	});
	// /Statics
	var User = mongoose.model('User', userSchema);

module.exports = User;