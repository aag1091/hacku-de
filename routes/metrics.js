
module.exports = function(app) {

  app.get('/metrics', function(req, res) {
    res.send([
        makeMetric("app-score"),
        makeMetric("page-speed"),
        makeMetric("unique-visits"),
        makeMetric("app-errors")
    ]);
  });

};

// Some Helpers
function randomScore(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function makeMetric(name) {
  var score = randomScore(0 ,180);
  return {
    name: name,
    score: score,
    alert: score < 50
  };
}

