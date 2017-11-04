var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/singup', (req, res, next)=>{
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(user != null) {
      var err = new Error('User' + req.body.username + ' already exists');
      err.status = 403;
      next(err);
    }else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user)=>{
    res.status = 200;
    res.setHeader('Content-type', 'application/json');
    res.json({status: 'Registration Successfully', user: user});
  }, (err)=> next(err))
  .catch((err)=>{
    next(err);
  })
});

router.post('/login', (req, res, next)=>{
  console.log(req.session);
  if(!req.session.user){
    var authHeader = req.headers.authorization;

    if(!authHeader){
        var error = new Error('You are not authenticated!');
      res.setHeader('www-Authenticate', 'Basic');
      error.status = 401;
      return next(error);
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    console.log(`authorized ::: ${auth}`);
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then((user)=>{
      if (user.username == username & user.password == password){
        // res.cookie('user', 'admin', {signed: true});
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        res.end('You are autheticated user');
      } else if (user.password != password) {
        var error = new Error('Your password is incorrect');
        error.statusCode = 403;
        return next(err);
      }else if (user == null) {
        var error = new Error('User ' + username + ' does not exist!');
        error.statusCode = 403;
        return next(err);
      }
    })
    .catch((err)=>next(err))

  }else {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end('You are already authenticated');
  }
})

router.get('/logout', (req, res) =>{

  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }else {
    var error = new Error('You have not logged in');
    error.statusCode = 403;
    return next(error);
  }

});

module.exports = router;
