var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var db  = require('./db');

// Load Routes
require('./routes/common')(app);
require('./routes/pull')(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    error: {
      code: err.status,
      message: err.message
    }
  });
});

module.exports = app;
