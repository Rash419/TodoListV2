var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//homepage
router.get('/', function (req, res, next) {
  res.render('index.ejs');
});

//dashboard
router.get('/dashboard', (req, res, next) => {
  res.render('home.ejs',{ layout : 'layout-home'});
});
module.exports = router;
