var step = require('step');
var request = require('request');
var moment = require('moment');
var metrics = require('../../models/metrics');

var THRESHOLD_UNIT = (180 / 100);
var ALERT_THRESHOLD = Math.floor(THRESHOLD_UNIT * 60);

exports.refresh = function (cb) {

  step(
      function () {
        return 65;
      },
      function (err, score) {
        if (err) return cb(err);

        var threshold = Math.ceil(THRESHOLD_UNIT * score);

        var metric = {
          name: "boattrader-page-speed",
          score: score,
          threshold: threshold,
          alert: threshold <= ALERT_THRESHOLD,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};

