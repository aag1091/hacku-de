
module.exports = function(app) {

  app.get('/', function(req, res) {
    res.send({
      project: "ROSS"
    });
  });

  app.get('/metrics', function(req, res) {
    res.send([
      {
        name: "conversion",
        range: {
          min: 1,
          max: 10
        },
        score: randomScore(1, 10)
      },
      {
        name: "page_speed",
        range: {
          min: 1,
          max: 10
        },
        score: randomScore(1, 10)
      },
      {
        name: "new_relic",
        range: {
          min: 1,
          max: 10
        },
        score: randomScore(1, 10)
      },
      {
        name: "app_rating",
        range: {
          min: 1,
          max: 10
        },
        score: randomScore(1, 10)
      }
    ]);
  });

};

function randomScore(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}
