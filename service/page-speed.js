var step = require('step');
var request = require('request');
var moment = require('moment');
var metrics = require('../models/metrics');

var THRESHOLD_UNIT = (180 / 100);
var ALERT_THRESHOLD = Math.floor(THRESHOLD_UNIT * 60);

exports.refresh = function (cb) {

  step(
      function () {
        request.get('https://analytics.forrent.com:8080/api/LegacyData?DataSets=MobileGCGooglePageSpeed&APIKey=6DE4C7F2-11E0-4994-B094-3F9B9CD88CE3', this);
      },
      function (err, response) {
        if (err) return cb(err);

        var score = JSON.parse(response.body).MobileGCGooglePageSpeed.ruleGroups.SPEED.score;
        var threshold = Math.ceil(THRESHOLD_UNIT * score);

        var metric = {
          name: "page-speed",
          score: score,
          threshold: threshold,
          alert: threshold <= ALERT_THRESHOLD,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};

