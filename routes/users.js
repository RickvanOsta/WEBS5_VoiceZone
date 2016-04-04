var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var User = require('../models/user');

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
/* GET users listing. */
router.get('/', function(req, res) {
        User.find(function(err, users) {
			if (err) {
				res.send(err);
			}
			res.json(users);
		});
});

/* POST users listing. */
router.post('/', function(req, res) {
		var user = new User();		// create a new instance of the User model
		user.username = req.body.username;  // set the users name (comes from the request)
        user.uid = req.body.uid;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;

		user.save(function(err) {
			if (err) {
				res.send(err);
			}
			console.log('USER CREATED');
			res.json({ message: 'User created!' });
		});

});



/* USERS + ID's */
// get the user with that id
router.get('/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	});

	// update the user with this id
router.put('/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {

			if (err) {
				res.send(err);
			}

			user.username = req.body.username;  // set the users name (comes from the request)
        	user.uid = req.body.uid;
        	user.firstname = req.body.firstname;
        	user.lastname = req.body.lastname;
        
			user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});
	});

	// delete the user with this id
router.delete('/:user_id', function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) {
				res.send(err);
			}
			
			res.json({ message: 'Successfully deleted' });
		});
});


router.get('/:user_id/voices',  function(req, res) {
		console.log(req.params.user_id);
		//console.log(res);

});

router.post('/test', uploads.single('upl') ,function(req, res) {
	//console.log(req.body);
	console.log("FILE RECEIVED: " + req.file); // files
	console.log(multer);

	fs.readdir('./uploads', function(err, data) {
		if (err) {
			return console.error("ERROR: " + err);
		}
		console.log("Received data: " + data);
	});

	res.json({ uploadedFile: req.file});
});

router.get('/directory', function (req, res) {

	console.log('directory!');

	fs.readdir('./uploads', function(err, data) {
		if (err) {
			return console.error("ERROR: " + err);
		}
		console.log("Received data: " + data);
	});

	//res.json({readdir: "readdir page"});
});


module.exports = router;
