const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');


const storage = multer.diskStorage({
  designation: (req, file, cb)=>{
    cb(null, '/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const imageFileFilter = (req, file, cb)=>{
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error("you can upload only image files with extension jpg, jpeg ,png ,gif"), false);
  }
  cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported on /imageupload');
})
.post(authenticate.verifyuser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('put operation not supported on /imageupload');
})
.delete(authenticate.verifyuser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('Delete operation not supported on /imageupload');
})

module.exports = uploadRouter;
