var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// ------------- routers details
var index = require('./routes/index');
var users = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promotionRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');


 // ---------------- Basic authentication

 function auth(req, res, next) {
   console.log(req.headers)

   var authHeader = req.headers.authorization;

   if(!authHeader){
       var error = new Error('Not an authorized user');
     res.setHeader('www-Authenticate', 'Basic');
     error.status = 401;
     return next(error);
   }

   var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
   console.log(`authorized ::: ${auth}`);
   var userName = auth[0];
   var password = auth[1];

   if (userName === 'admin' & password === 'password'){
     next();
   }else {
     var error = new Error('Not an authorized user');
   res.setHeader('www-Authenticate', 'Basic');
   error.status = 401;
   return next(error);
   }
 }

// ---------- mongoose connection details
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';

const connect = mongoose.connect(url, {
  useMongoClient: true
});

connect.then((db)=>{
  console.log('Successfully connected to db');
},(error)=>{
  console.log(error);
});

// ---------- express server initialize
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(auth);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
