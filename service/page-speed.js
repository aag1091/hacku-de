var step = require('step');
var request = require('request');
var moment = require('moment');
var metrics = require('../models/metrics');

exports.get = function(cb) {

  step(
      function() {
        request.get('https://analytics.forrent.com:8080/api/LegacyData?DataSets=MobileGCGooglePageSpeed&APIKey=6DE4C7F2-11E0-4994-B094-3F9B9CD88CE3', this);
      },
      function(err, response) {
        if(err) return cb(err);

        var speed = JSON.parse(response.body).MobileGCGooglePageSpeed.ruleGroups.SPEED;

        var metric = {
          name: "page-speed",
          score: speed,
          timestamp: moment().format('x')
        };

        metrics.insert(metric, cb);
      }
  )

};

exports.range = {
  min: 0,
  max: 100
};
