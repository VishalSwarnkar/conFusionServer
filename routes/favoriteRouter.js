const express = require('express');
const bodyParser = require('body-parser');
const favoriteRouter  = express.Router();
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyuser, (req, res, next) => {
  Favorite.find({user: req.user._id})
  .populate('user')
  .populate('dishes')
  .then((favourites)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(favourites);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post(cors.corsWithOptions, authenticate.verifyuser, (req, res, next) => {
  Favorite.findOne({'user': req.user._id})
  .then((favorites)=>{
    if (!favorites) {
          Favorite.create(req.body, (err, favorite)=> {
              if (err) throw err;
              console.log('Favorite created!');
              favorite.user = req.user._id;
              favorite.save((err, favorite)=> {
                  if (err) throw err;
                  res.json(favorite);
              });
          });
    } else {
          var dish = req.body._id;
          if (favorites.dishes.indexOf(dish) == -1) {
              favorites.dishes.push(dish);
          }
          favorites.save(function (err, favorite) {
              if (err) throw err;
              res.json(favorite);
          });
      }
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyuser, (req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyuser, (req, res, next) => {
  Favorite.remove({'user': req.user._id})
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err)=>next(err))
  .catch((error)=>next(error));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyuser, (req, res, next) => {
  Favorite.findOne({'user': req.user._id})
  .then((favorites)=>{
    if(!favorites){
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      return res.json("exists": false, "favorites": favorites);
    }else {
      if(favorites.dishes.indexOf(req.params.dishId) < 0){
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        return res.json("exists": false, "favorites": favorites);
      }else{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        return res.json("exists": true, "favorites": favorites);
      }
    }
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post(cors.corsWithOptions, authenticate.verifyuser, (req, res, next) => {
  Favorite.findOne({'user': req.user._id})
  .then((favorites)=>{
    if (!favorites) {
          Favorite.create(req.params.dishId, (err, favorite)=> {
              if (err) throw err;
              console.log('Favorite created!');
              favorite.user = req.user._id;
              favorite.save((err, favorite)=> {
                  if (err) throw err;
                  res.json(favorite);
              });
          });
    } else {
          var dish = req.params.dishId;
          if (favorites.dishes.indexOf(dish) == -1) {
              favorites.dishes.push(dish);
          }
          favorites.save(function (err, favorite) {
              if (err) throw err;
              res.json(favorite);
          });
      }
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyuser, (req, res, next) => {
  Favorite.findOneAndUpdate({'user': req.user._id}, {$pull: {dishes: req.params.dishId}})
  .then((favorite)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    Favorites.findById(favorite._id)
    .populate('user')
    .populate('dishes')
    .then((favorite)=>{
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.json(favorite);
    })
  }, (err)=>next(err))
  .catch((error)=>next(error));
});

module.exports = favoriteRouter;
