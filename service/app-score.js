var step = require('step');
var request = require('request');
var DOMParser = require('xmldom').DOMParser;
var xpath = require('xpath');
var moment = require('moment');
var metrics = require('../models/metrics');

var THRESHOLD_UNIT = (180 / 5);

exports.refresh = function(cb) {

  step(
      function() {
        request.get('https://play.google.com/store/apps/details?id=com.forrent.frmobile', this);
      },
      function(err, response) {
        if(err) return cb(err);

        var doc = new DOMParser().parseFromString(response.body);
        var score = xpath.select('//div[@class="score"]', doc)[0].lastChild.data;

        var metric = {
          name: "app-score",
          score: +score,
          threshold: Math.ceil(THRESHOLD_UNIT * score),
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};
