var step = require('step');
var request = require('request');
var moment = require('moment');
var metrics = require('../../models/metrics');
var _ = require('lodash');

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
        request.get('https://analytics.forrent.com:8080/api/LegacyData?DataSets=OLTP_GuestCardVelocity&APIKey=6DE4C7F2-11E0-4994-B094-3F9B9CD88CE3', this);
      },
      function (err, response) {
        if (err) return cb(err);

        var json = JSON.parse(response.body);
        var leads = _.map(json.OLTP_GuestCardVelocity.seriesList, function(obj) {
          return obj.dataPoints[0];
        }).reduceRight(function(p, n) {
          return p + n;
        });

        var threshold = Math.ceil(THRESHOLD_UNIT * leads);

        var metric = {
          name: "forrent-leads",
          score: leads,
          threshold: threshold,
          alert: threshold <= ALERT_THRESHOLD,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};

