var _ = require('lodash');
var step = require('step');
var metrics = require('../models/metrics');
var metricUtils = require('../utils/metrics');
var request = require('request');

module.exports = function (app) {

  var reqNum = 0;
  app.get('/metrics', function (req, res, next) {
    var companies = {
      forrent: 0,
      boattrader: 90,
      acme: 180
    };
    var company = Object.getOwnPropertyNames(companies)[reqNum];

    // request rotation
    if(reqNum !== 2) reqNum++;
    else reqNum = 0;

    step(
        function () {
          metrics.latestPayload(company, this);
        },
        function (err, payload) {
          if (err) next(err);
          payload.company = companies[company];
          payload.alert = false;

          Object.getOwnPropertyNames(payload).forEach(function(p) {
            if (_.isBoolean(payload[p]) && payload[p] === true) {
              payload.alert = true;
            }
          });

          res.send(payload);
        }
    )
  });

};
