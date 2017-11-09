const express = require('express');
const bodyParser = require('body-parser');
const leadersRouter  = express.Router();
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
.get((req, res, next) => {
  Leaders.find({})
  .then((leaders)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post(authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  Leaders.create(req.body)
  .then((leaders)=>{
    console.log('Promotions created');
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders);
  }, (err)=>next(err))
  .catch((err)=>next(err));
})
.put(authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported /leaders');
})
.delete(authenticate.verifyuser, authenticate.verifyAdmin,  (req, res, next) => {
  Leaders.remove({})
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})

// ---------------------------------------------------------------------------------
leadersRouter.route('/:leaderId')
.get((req, res, next) => {
  Leaders.findById(req.params.leaderId)
  .then((leader)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(leader);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.post(authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('Post operation not supported ' +
  req.params.leaderId);
})
.put(authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next) => {
  Leaders.findByIdAndUpdate(req.params.leaderId, {
    $set: req.body
  }, {new: true} )
  .then((leaders)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders);
  }, (err)=>next(err))
  .catch((error)=>next(error));
})
.delete(authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next) => {
  Leaders.findByIdAndRemove(req.params.leaderId)
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err)=>next(err))
  .catch((error)=>next(error));
});

module.exports = leadersRouter;
