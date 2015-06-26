var _ = require('lodash');
var step = require('step');
var metrics = require('../models/metrics');
var metricUtils = require('../utils/metrics');
var request = require('request');

module.exports = function (app) {

  app.get('/metrics', function (req, res) {
    var metrics = {};
    _.merge(
        metrics,
        metricUtils.fakeMetric("app-score"),
        metricUtils.fakeMetric("page-speed"),
        metricUtils.fakeMetric("leads")
    );

    metrics.company = metricUtils.randomScore(0, 180);

    metrics.alert = false;
    Object.getOwnPropertyNames(metrics).forEach(function(p) {
      if (_.isBoolean(metrics[p]) && metrics[p] === true) {
        metrics.alert = true;
      }
    });

    res.send(metrics);
  });

  app.get('/metrics-working', function (req, res, next) {
    //var company = "forrent";
    var company = "boattrader";
    var companies = {
      forrent: 0,
      boattrader: 90,
      other: 180
    };

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

  app.get('/metrics-test', function (req, res) {
    request('http://api.openweathermap.org/data/2.5/weather?q=norfolk,us', function (err, response) {
      res.send(JSON.parse(response.body));
    });
  });

};
