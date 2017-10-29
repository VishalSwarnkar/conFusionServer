const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter  = express.Router();

const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req, res, next) => {
  Promotions.find({})
  .then((promos)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post((req, res, next) => {
  Promotions.create(req.body)
  .then((promos)=>{
    console.log('Promotions created');
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
  }, (err)=>next(err))
  .catch((err)=>next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported /promotions');
})
.delete((req, res, next) => {
  Promotions.remove({})
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})

// -----------------------------------------------------------------------------
promotionRouter.route('/:promotionId')
.get((req, res, next) => {
  Promotions.findById(req.params.promotionId)
  .then((promo)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('Post operation not supported ' +
  req.params.promotionId);
})
.put((req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.promotionId, {
    $set: req.body
  }, {new: true} )
  .then((promos)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.delete((req, res, next) => {
  Promotions.findByIdAndRemove(req.params.promotionId)
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err)=>next(err))
  .catch((error)=>next(error));
});

module.exports = promotionRouter;
