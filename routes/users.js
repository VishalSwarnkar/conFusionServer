var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

router.use(bodyParser.json());
/* GET users listing. */

router.options('*', cors.corsWithOptions, (req, res)=> {
  res.sendStatus = 200;
})

router.get('/', cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next)=> {
     User.find({}, function(err, users){
      if(err){
        res.status = 500;
        res.setHeader('Content-type', 'application/json');
        res.json({err:err});
      }else {
        res.json(users);
      }
  });
});

router.post('/signup', cors.corsWithOptions, (req, res, next)=>{
  User.register(new User({username: req.body.username}),
   req.body.password, (err, user) => {
    if(err) {
      res.status = 500;
      res.setHeader('Content-type', 'application/json');
      res.json({err:err});
    }else {
      if(req.body.firstname)
        user.fistname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user)=>{
        if(err) {
          res.status = 500;
          res.setHeader('Content-type', 'application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req, res, ()=>{
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({success: true, status: 'Registration Successfully'});
        });
      });
    }
  });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'),(req, res, next)=>{
  passport.authenticate('local', (err, user, info)=>{
      if(err)
        return next(err);
      if(!user){
        res.status = 401;
        res.setHeader('Content-type', 'application/json');
        res.json( {success: false, token: token, status: 'Loggin unsuccessful', err: info});
      }
      req.logIn(user, (err)=>{
        if(err) {
          res.status = 401;
          res.setHeader('Content-type', 'application/json');
          res.json( {success: false, token: token, status: 'Loggin unsuccessful', err: 'Could not logged in user'});
        }
        var token = authenticate.getToken({_id: req.user._id});
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json( {success: true, token: token, status: 'Loggin Successful', token: token});
      });
  })(req, res, next);
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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) =>{
  if(req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.status = 200;
    res.setHeader('Content-type', 'application/json');
    res.json( {success: true, token: token, status: 'You are Successfully logged in'});
  }
})

router.get('/checkJWToken', cors.corsWithOptions, (req, res)=>{
  passport.authenticate('jwt', {'session':false}, (err, user, info)=> {
    if(err)
    return next(err);

    if(!user){
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'JWT invalid!', success: false, err: info})
    }else {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'JWT valid!', success: true, user: info})
    }
  })(req, res);
});

module.exports = router;
