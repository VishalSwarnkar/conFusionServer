const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter  = express.Router();
const cors = require('./cors');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

const authenticate = require('../authenticate');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
  Promotions.find(req.query)
  .then((promos)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post(cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  Promotions.create(req.body)
  .then((promos)=>{
    console.log('Promotions created');
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
  }, (err)=>next(err))
  .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
  Promotions.findById(req.params.promotionId)
  .then((promo)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post(cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  res.statusCode = 403;
  res.end('Post operation not supported ' +
  req.params.promotionId);
})
.put(cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  Promotions.findByIdAndRemove(req.params.promotionId)
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err)=>next(err))
  .catch((error)=>next(error));
});

module.exports = promotionRouter;
