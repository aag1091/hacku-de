var step = require('step');
var request = require('request');
var moment = require('moment');
var metrics = require('../../models/metrics');
var metricsUtil = require('../../utils/metrics');

var THRESHOLD_UNIT = (180 / 5);
var ALERT_THRESHOLD = Math.floor(THRESHOLD_UNIT * 3);

exports.refresh = function (cb) {

  step(
      function () {
        return metricsUtil.randomScore(0, 5);
      },
      function (err, score) {
        if (err) return cb(err);

        var threshold = Math.ceil(THRESHOLD_UNIT * score);

        var metric = {
          name: "acme-app-score",
          score: +score,
          threshold: threshold,
          alert: threshold <= ALERT_THRESHOLD,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};
