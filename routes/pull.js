var step = require('step');
var request = require('request');
var DOMParser = require('xmldom').DOMParser;
var xpath = require('xpath');
var moment = require('moment');
var metrics = require('../models/metrics');

module.exports = function(app) {

  app.get('/pull/:metric', function(req, res) {

    step(
        function() {
          request.get('https://play.google.com/store/apps/details?id=com.forrent.frmobile', this);
        },
        function(err, response) {
          var doc = new DOMParser().parseFromString(response.body);
          var score = xpath.select('//div[@class="score"]', doc)[0].lastChild.data;

          var metric = {
            name: "app_rating",
            score: score,
            timestamp: moment().format('x')
          };

          metrics.insert(metric, function(err, result) {
            if(err) next(err);

            res.send(result);
          });
        }
    )

  });
};
