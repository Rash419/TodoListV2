var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//homepage
router.get('/', function (req, res, next) {
  res.render('index.ejs');
});

//dashboard
router.get('/today', (req, res, next) => {
  res.render('today.ejs',{ layout : 'layout-home'});
});
module.exports = router;
