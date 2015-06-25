var _ = require('lodash');
var step = require('step');
var metrics = require('../models/metrics');

module.exports = function(app) {

  app.get('/metrics', function(req, res) {
    var metrics = makeMetric("app-score", ",")
                + makeMetric("page-speed", ",")
                + makeMetric("unique-visits", ",")
                + makeMetric("app-errors");

    res.send(metrics);
  });

  app.get('/metrics-working', function(req, res, next) {
    step(
        function() {
          metrics.latestPayload(this);
        },
        function(err, payload) {
          if(err) next(err);
          res.send(payload);
        }
    )
  });

};

// Some Helpers
function randomScore(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function makeMetric(name, suffix) {
  var score = randomScore(0 ,180);

  return score + ", " + boolToString(score < 50) + (suffix ? suffix : "");
}

function boolToString(b) {
  return b ? 1 : 0;
}
