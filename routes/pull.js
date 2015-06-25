var _ = require('lodash');

var serviceResolver = {
  "app-score": require('../service/app-score'),
  "page-speed": require('../service/page-speed')
};

module.exports = function(app) {

  app.get('/pull/:metric', function(req, res, next) {
    var metric = req.params.metric;

    if(_.has(serviceResolver, metric)) {
      serviceResolver[metric].get(function(err, result) {
        if(err) next(err);
        res.send(result);
      });
    } else {
      throw Error("No metric available for " + metric);
    }

  });
};
