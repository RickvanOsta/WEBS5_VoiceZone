var express = require('express');
var router = express.Router();
var multer = require('multer');
var Voice = require('../models/voice');
var fs = require('fs');
var configAuth = require('../config/auth');
var SoundCloud = require('soundjs');


var sc = new SoundCloud(configAuth.soundcloudAuth.clientID, 
						configAuth.soundcloudAuth.clientSecret, 
						configAuth.soundcloudAuth.userName, 
						configAuth.soundcloudAuth.password, 
						configAuth.soundcloudAuth.callbackURL);



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
		Voice
			.find()
			.populate('user')
			.exec(function(err, voices) {
			if (err)
				res.send(err);
			res.status(200);
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
		voice.user = "56fd16a4d8996a742ae10954";//req.body.uid;
		voice.playlist = "";
		
		sc.playlists().then(function(playlist){
		voice.playlist.url = playlist[0].permalink_url;
		voice.playlist.genre = playlist[0].genre;
		voice.playlist.desc = playlist[0].description;
		console.log(playlist);
		console.log(voice);
		voice.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.status(201);
			res.json({ message: 'Voice created!', uploadedFile: req.file, filename: req.file.filename });
		});
		});

		
});

/* ID's */
// get the voice with that id
router.get('/:voice_id', function(req, res) {
		Voice
			.findById(req.params.voice_id)
			.populate('user')
			.exec(function(err, voice) {
			if (err) {
				res.send(err);
			}
			res.status(200);
			res.json(voice);
		});
});

	// update the voice with this filename
router.put('/:voice_fileName', function(req, res) {

		console.log('filename = ' + req.params.voice_fileName);
		console.log('body: ');
		console.log(req.body.uid);
		Voice.findOne({ fileName: req.params.voice_fileName}, function(err, voice) {

			if (err) {
				res.send(err);
			}

			voice.user = req.body.uid;
			voice.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.status(200);
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
			res.status(200);
			res.json({ message: 'Successfully deleted' });
		});
});



module.exports = router;
