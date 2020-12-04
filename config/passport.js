var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModel = require('../model/User');
var bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' },

        (email, password, done) => {
            userModel.findOne({ email: email }, (err, user) => {
                if (err) { return done(err) }
                else {
                    if (!user) {
                        return done(null, false, { message: 'Email is not registered' });
                    } else {
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) { throw err }
                            else {
                                if (!isMatch) {
                                    return done(null, false, { message: 'Password is incorrect' });
                                } else {
                                    return done(null, user);
                                }
                            }
                        })
                    }
                }
            }).catch(err => console.log(err));
        }
    ))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        userModel.findById(id, function (err, user) {
            done(err, user);
        });
    });
}