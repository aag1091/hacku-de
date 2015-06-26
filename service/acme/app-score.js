var step = require('step');
var request = require('request');
var DOMParser = require('xmldom').DOMParser;
var xpath = require('xpath');
var moment = require('moment');
var metrics = require('../../models/metrics');

var THRESHOLD_UNIT = (180 / 5);
var ALERT_THRESHOLD = Math.floor(THRESHOLD_UNIT * 3);

exports.refresh = function (cb) {

  step(
      function () {
        return 0;
      },
      function (err, score) {
        if (err) return cb(err);

        var threshold = Math.ceil(THRESHOLD_UNIT * score);

        var metric = {
          name: "boattrader-app-score",
          score: +score,
          threshold: threshold,
          alert: threshold <= ALERT_THRESHOLD,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};
