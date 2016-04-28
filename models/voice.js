var mongoose     = require('mongoose');

	var Schema = mongoose.Schema;

	var voiceSchema = new Schema({
		title: { type: String, required: true },
		fileName: { type: String, required: true},
		fileLocation: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        playlist         : {
        url           : String,
        genre        : String,
        desc        : String,
        }
	});
	// /Statics
	var Voice = mongoose.model('Voice', voiceSchema);

module.exports = Voice;