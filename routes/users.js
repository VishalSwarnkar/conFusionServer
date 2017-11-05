var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next)=>{
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

router.post('/login', passport.authenticate('local'),(req, res)=>{

  var token = authenticate.getToken({_id: req.user._id});
  res.status = 200;
  res.setHeader('Content-type', 'application/json');
  res.json( {success: true, token: token, status: 'You are Successfully logged in'});

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
