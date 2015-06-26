var _ = require('lodash');
var step = require('step');
var metrics = require('../models/metrics');
var request = require('request');

module.exports = function (app) {

  app.get('/metrics', function (req, res) {
    var metrics = {};
    _.merge(
        metrics,
        makeMetric("app-score"),
        makeMetric("page-speed"),
        makeMetric("leads")
    );

    metrics.company = randomScore(0, 180);

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

// Some Helpers
function randomScore(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function makeMetric(name) {
  var score = randomScore(0, 180);
  var metric = {};
  var _name = name.replace('-', '');

  metric[_name + 'threshold'] = score;
  metric[_name + 'alert'] = score < 50;

  return metric;
}
