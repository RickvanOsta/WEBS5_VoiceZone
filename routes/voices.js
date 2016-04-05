var express = require('express');
var router = express.Router();
var multer = require('multer');
var Voice = require('../models/voice');

var uploads = multer({
	dest: './public/uploads/',
	rename: function (fieldname, filename) {
		console.log("Rename...");
		return filename;
	},
	onFileUploadStart: function () {
		console.log("Upload is starting...");
	},
	onFileUploadComplete: function () {
		console.log("File uploaded");
	}
});

/* VOICES */
/* GET voices listing. */
router.get('/', function(req, res) {
        Voice.find(function(err, voices) {
			if (err)
				res.send(err);

			res.json(voices);
		});
});

/* POST voices listing. */
router.post('/', uploads.single('upl'), function(req, res) {

		//log
		console.log('FILE RECEIVED: ' + req.file);
		var path = "/uploads/" + req.file.filename;


		//ADD VOICE FILE, NO USER IS BEING SENT TO THIS YET SO UPDATE AFTER THE VOICE HAS BEEN ADDED
		var voice = new Voice();		// create a new instance of the Voice model
		voice.title = req.file.originalname;  // set the voices name (comes from the request)
		voice.fileName = req.file.filename;
		voice.fileLocation = path;
        voice.user = "test1234";//req.body.uid;

		voice.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Voice created!', uploadedFile: req.file });
		});
});

/* ID's */
// get the voice with that id
router.get('/:voice_id', function(req, res) {
		Voice.findById(req.params.voice_id, function(err, voice) {
			if (err) {
				res.send(err);
			}
			res.json(voice);
		});
});

	// update the voice with this filename
router.put('/:voice_fileName', function(req, res) {
		Voice.find({ fileName: req.params.voice_fileName}).exec(function(err, voice) {

			if (err) {
				res.send(err);
			}

			voice.user = req.body.uid;
			voice.save(function(err) {
				if (err) {
					res.send(err);
				}

				res.json({ message: "Voice updated"});
			})
		});
		// Voice.findById(req.params.voice_id, function(err, voice) {
        //
		// 	if (err) {
		// 		res.send(err);
		// 	}
        //
		// 	voice.title = req.body.title;  // set the voices name (comes from the request)
         //    voice.fileLocation = req.body.fileLocation;
         //    voice.user = req.body.uid;
		// 	voice.save(function(err) {
		// 		if (err)
		// 			res.send(err);
        //
		// 		res.json({ message: 'Voice updated!' });
		// 	});
        //
		// });
});

	// delete the voice with this id
router.delete('/:voice_id', function(req, res) {
		Voice.remove({
			_id: req.params.voice_id
		}, function(err, voice) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
});



module.exports = router;
