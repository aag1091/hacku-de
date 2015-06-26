var step = require('step');
var request = require('request');
var moment = require('moment');
var metrics = require('../../models/metrics');
var _ = require('lodash');
var metricsUtil = require('../../utils/metrics');

var THRESHOLD_UNIT = (180 / 50);
var ALERT_THRESHOLD = THRESHOLD_UNIT; // 1 lead

/**
 * 0 - 2000
 * 0 is alarm
 */

// These are leads from desktop submission
exports.refresh = function (cb) {

  step(
      function () {
        return metricsUtil.randomScore(0, 175);
      },
      function (err, score) {
        if (err) return cb(err);

        var threshold = Math.ceil(THRESHOLD_UNIT * score);

        var metric = {
          name: "acme-leads",
          score: score,
          threshold: threshold,
          alert: threshold <= ALERT_THRESHOLD,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};

