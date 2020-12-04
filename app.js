var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

//connect to database
var mongoConfig = require('./config/key');
mongoose.connect(mongoConfig.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) { console.log(err) }
  else { console.log('MongoDb connected') };
});
//mongoose.set('bufferCommands',false);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

//flash
app.use(flash());

//global vars
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ejs-layout
var expressLayout = require('express-ejs-layouts');
const passport = require('passport');
app.use(expressLayout);

//passport config
var passportConfig = require('./config/passport');
passportConfig(passport);

//passport
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
