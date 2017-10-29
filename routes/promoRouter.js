const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter  = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req, res, next) =>{
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req, res, next) => {
  res.end('Will send all the promotions');
})
.post((req, res, next) => {
  res.end('Will add the promotions ' + req.body.name + ' with details ' + req.body.description);
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported /promotions');
})
.delete((req, res, next) => {
  res.end('Deleting all the promotions');
})

// ---------------------------------------------------------------------------------
promotionRouter.route('/:promotionId')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
})
.get((req, res, next) => {
  res.end('Will send all the promotions ' +
  req.params.promotionId + ' to you');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('Post operation not supported ' +
  req.params.promotionId);
})
.put((req, res, next) => {
  res.write('Updating the promotion ' + req.params.promotionId + '\n');
  res.end(' Will update the promotion ' + req.body.name +
  ' with details '+ req.body.description);
})
.delete((req, res, next) => {
  res.end('Deleting promotion ' + req.params.promotionId);
});

module.exports = promotionRouter;
