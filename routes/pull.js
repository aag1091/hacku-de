var _ = require('lodash');
var step = require('step');

var serviceResolver = {
  forrent: {
    "app-score": require('../service/forrent/app-score'),
    "page-speed": require('../service/forrent/page-speed'),
    "leads": require('../service/forrent/leads')
  }
};

module.exports = function (app) {

  app.get('/pull/all', function (req, res) {

    step(
        function () {
          var group = this.group();
          Object.getOwnPropertyNames(serviceResolver).forEach(function (c) {
            Object.getOwnPropertyNames(serviceResolver[c]).forEach(function(p) {
              serviceResolver[c][p].refresh(function (err, payload) {
                if (err) console.error(err);
                group();
              });
            });
          });
        },
        function () {
          res.send('processed');
        }
    )
  });

  app.get('/pull/:company/:metric', function (req, res, next) {
    var metric = req.params.metric;
    var company = req.params.company;

    if (_.has(serviceResolver[company], metric)) {
      serviceResolver[company][metric].refresh(function (err, result) {
        if (err) next(err);
        res.send(result);
      });
    } else {
      throw Error("No metric available for " + metric);
    }

  });

};
