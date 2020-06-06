var express = require('express');
var router = express.Router();
var db = require('../models')
var {Book} = db;

router.get('/', async function (req, res, next) {
  res.redirect('/books');
});


module.exports = router;
