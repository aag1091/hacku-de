var _ = require('lodash');
var step = require('step');

var serviceResolver = {
  "app-score": require('../service/app-score'),
  "page-speed": require('../service/page-speed')
};

module.exports = function(app) {

  app.get('/pull/all', function(req, res) {

    step(
        function() {
          var group = this.group();
          Object.getOwnPropertyNames(serviceResolver).forEach(function(p){
            serviceResolver[p].refresh(function(err, payload) {
              if(err) console.error(err);
              group();
            });
          });
        },
        function() {
          res.send('processed');
        }
    )
  });

  app.get('/pull/:metric', function(req, res, next) {
    var metric = req.params.metric;

    if(_.has(serviceResolver, metric)) {
      serviceResolver[metric].refresh(function(err, result) {
        if(err) next(err);
        res.send(result);
      });
    } else {
      throw Error("No metric available for " + metric);
    }

  });

};
