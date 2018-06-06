/**
 * app.js
 *
 * Main execution file for this project.
 */

 /** External modules **/
var createError = require('http-errors');
var express = require('express')
var mongoose = require('mongoose');
var util = require('util');
var path = require('path');
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

/** Internal modules **/
var config = require('./private/config');
var authController = require('./controllers/AuthController');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

/** Models **/


/** Database setup **/
mongoose.connect(config.DB_PATH);

/** Express setup **/
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/*** Passport Initial ***/
app.use(session({
   keys: config.SESSION_SECRET_KEYS,
   cookie: { maxAge: 60000 }
}))
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/*** Routes ****/
app.use('/', authController.router);
app.use('/admin', authController.isAuthenticated);
app.use('/', usersRouter);
app.use('/', adminRouter);
app.use('/', indexRouter);
app.all('*', function (req, res){
 res.status(403).render('404.ejs');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start server
 var port = config.PORT || 3000;
 app.listen(port,function(){
 	console.log("running on port "+ port);
 })
 console.log('\n--- Information ---');
 console.log('  Port:',port);
 console.log('  Database:',config.DB_PATH);
