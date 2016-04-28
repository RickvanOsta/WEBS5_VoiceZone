var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require('../models/user');
var Voice = require('../models/voice');
var configAuth = require('../config/auth');
var SoundCloud = require('soundjs');


var sc = new SoundCloud(configAuth.soundcloudAuth.clientID, 
                        configAuth.soundcloudAuth.clientSecret, 
                        configAuth.soundcloudAuth.userName, 
                        configAuth.soundcloudAuth.password, 
                        configAuth.soundcloudAuth.callbackURL);



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
        user.photoUrl = req.body.photoUrl;
        user.gender = req.body.gender;
        
        
        user.playList = "";
        
        
        sc.playlists().then(function(playlist){
        user.playList = playlist;
        console.log(user);
        user.save(function(err) {
			if (err) {
				res.send(err);
			}
			console.log('USER CREATED');
			res.json({ message: 'User created!' });
		});
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
            user.photoUrl = req.body.photoUrl;
            user.gender = req.body.gender;

        
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
		Voice.find({ user: req.params.user_id}).exec(function (err, voices) {
			res.json(voices);
		});
	
});


module.exports = router;
