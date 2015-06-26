var _ = require('lodash');
var step = require('step');
var metrics = require('../models/metrics');
var request = require('request');

module.exports = function (app) {

  app.get('/metrics', function (req, res) {
    var metrics = {};
    _.merge(
        metrics,
        makeMetric("as"),
        makeMetric("ps"),
        makeMetric("uv"),
        makeMetric("ae")
    );

    res.send(metrics);
  });

  app.get('/metrics-working', function (req, res, next) {

    var companies = {
      forrent: 0,
      boattrader: 90,
      other: 180
    };

    step(
        function () {
          metrics.latestPayload("forrent", this);
        },
        function (err, payload) {
          if (err) next(err);
          payload.company = companies.forrent;
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

  metric[_name + 't'] = score;
  //metric[_name + 'alert'] = score < 50;

  return metric;
}
