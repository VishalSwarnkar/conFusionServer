const express = require('express');
const cors = require('cors');
const app = express();
const whileList = ['http://localhost:3000', 'https://localhost:3443'];

const corsOptionsDelegate = (req, callback) =>{
  var corsOptions;
  console.log(req.header('Origin'));
  if(whileList.indexOf(req.header('Origin')) !== -1) {
    corsoptions = {origin: true}
  }else {
    corsOptions = {origin: false};
  }
  callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
