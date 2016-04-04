var express = require('express');
var router = express.Router();
var multer = require('multer');
var Voice = require('../models/voice');

var uploads = multer({
	dest: 'uploads/',
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

/* USERS */
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

		var voice = new Voice();		// create a new instance of the Voice model
		voice.title = req.file.originalname;  // set the voices name (comes from the request)
        voice.fileLocation = req.file.path;
        voice.user = "57024f4c6afe5c1100a83d67";//req.body.uid;

		voice.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Voice created!', uploadedFile: req.file });
		});
});

router.post('/test', uploads.single('upl') ,function(req, res) {
	//console.log(req.body);
	console.log("FILE RECEIVED: " + req.file); // files
	console.log(multer);

	fs.readFile('./uploads', function(err, data) {
		if (err) {
			return console.error("ERROR: " + err);
		}
		console.log("Received data: " + data);
	});

	res.json({ uploadedFile: req.file});
});


/* USERS + ID's */
// get the voice with that id
router.get('/:voice_id', function(req, res) {
		Voice.findById(req.params.voice_id, function(err, voice) {
			if (err)
				res.send(err);
			res.json(voice);
		});
	});

	// update the voice with this id
router.put('/:voice_id', function(req, res) {
		Voice.findById(req.params.voice_id, function(err, voice) {

			if (err)
				res.send(err);

			voice.title = req.body.title;  // set the voices name (comes from the request)
            voice.fileLocation = req.body.fileLocation; 
            voice.user = req.body.uid; 
			voice.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Voice updated!' });
			});

		});
	})

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
