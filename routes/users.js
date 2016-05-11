var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require('../models/user');
var Voice = require('../models/voice');





/* USERS */
/* GET users listing. */
router.get('/', function(req, res) {

		var query = {};

		if (req.query.email) {
			query['local.email'] = req.query.email;
		}
		if (req.query.fbName) {
			query['facebook.name'] = req.query.fbName;
		}
		if (req.query.fbEmail) {
			query['facebook.email'] = req.query.fbEmail;
		}
		if (req.query.fbGender) {
			query['facebook.gender'] = req.query.fbGender;
		}
		console.log(query);
        User.find(query)
			.exec(function(err, users) {
			if (err) {
				res.send(err);
			}
            res.status(200);
			res.json(users);
		});
});

/* USERS + ID's */
// get the user with that id
router.get('/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.send(err);
			}
            res.status(200);
			res.json(user);
		});
	});

	// update the user with this id
router.put('/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {

			if (err) {
				res.send(err);
			}

			console.log(req.body);
			user.local.email = req.body.email;  // set the users email (comes from the request)
        
			user.save(function(err) {
				if (err)
					res.send(err);
                    res.status(200);
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
			res.status(202);
			res.json({ message: 'Successfully deleted' });
		});
});


router.get('/:user_id/voices',  function(req, res) {

		var query = {};
		query.user = req.params.user_id;
		if (req.query.fileName) {
			query.fileName = req.query.fileName;
		}
		if (req.query.title) {
			query.title = req.query.title;
		}

		console.log(req.params.user_id);
		//console.log(res);
		Voice.find(query).exec(function (err, voices) {
            res.status(200);
			res.json(voices);
		});
});


module.exports = router;
