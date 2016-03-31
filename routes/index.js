var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index.ejs');
  res.render('admin.ejs');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

module.exports = router;
