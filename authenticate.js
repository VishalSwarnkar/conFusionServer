var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user) {
  return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =  config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
  console.log("JWT payload "+jwt_payload);
  User.findOne({_id: jwt_payload._id}, (err, user) =>{
    if(err){
      return done(err, false);
    }else if (user) {
      return done(null, user);
    }else {
      return done(null, false);
    }
  })
}));

exports.verifyAdmin = function(req, res, next) {
  console.log(req.user);
  if(req.user.admin){
    next();
  }else {
    var err = new Error('You are not authenticated!');
     err.status = 401;
     next(err);
  }
}

exports.verifyCommentUser = function(req, res, next) {
  if(!req.user.admin){
    next();
  }else {
    var err = new Error('You are not authenticated!');
     err.status = 401;
     next(err);
  }
}

exports.me = function(req,res){
  // console.log(req);
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization;
        try {
            decoded = jwt.verify(authorization, config.secretKey);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        var userId = decoded.id;
        console.log(userId);
        // Fetch the user by id
        // User.findOne({_id: userId}).then(function(user){
        //     // Do something with the user
        //     return res.send(200);
        // });
        return userId;
    }
    return res.send(500);
}

exports.verifyuser = passport.authenticate('jwt', {session: 'false'});
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
  },(accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user)=>{
      if(err){
        return done(err, false);
      }
      if(!err && user !== null) {
        return done(null, user)
      }else{
        user = new User({username: profile.displayName});
        user.facebookId = profile.id;
        user.firstname = profile.name.givenName;
        user.lastname = profile.name.familyName;
        user.save((err, user) => {
          if(err){
            return done(err, false);
          }else{
            return done(null, user);
          }
        })
      }
    })
  }
));
