var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
var userModel = require('../model/User');
var bcrypt = require('bcryptjs');
var passport = require('passport');

//login page
router.get('/login', (req, res, next) => {
  res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/users/login', failureFlash: true }));

//register page
router.get('/register', (req, res, next) => {
  res.render('register.ejs');
});

router.post('/register', [
  body('name').isLength({ min: 1 }).withMessage('Name must be specified'),


  body('email').isEmail().withMessage('Enter email properly').custom((value) => {
    return userModel.findOne({ email: value }).then(email => {
      if (email) {
        return Promise.reject('User with mentioned email already exist');
      }
    });
  }),

  body('password').isLength({ min: 6 }).withMessage('Password length must of at least 6 character'),

  body('password2').custom((value, { req }) => {
    if (value === '') {
      throw new Error('Please confirm your password');
    }
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })

], (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('register.ejs', { errors: errors.array(), name: name, email: email, password: password, password2: password2 });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        const newUser = new userModel({
          name,
          email,
          password: hash,
        })
        newUser.save((err) => {
          if (err) { return next; }
          else {
            req.flash("success_msg", "you have successfully registered");
            res.redirect('/users/login');
          }
        })
      })
    })
  }
});
module.exports = router;
