var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//homepage
router.get('/', function (req, res, next) {
  res.render('home.ejs');
});

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  res.send('yet to be implemented');
});
module.exports = router;
