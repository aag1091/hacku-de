var step = require('step');
var _ = require('lodash');
var r = require('rethinkdb');
var db = require('../db');
var connectThen = db.connectThen;
var rdb = db.rdb;
var tableName = 'metrics';

var MAX_METRIC = 180;

db.createTable(tableName);

var table = rdb.table(tableName);

exports.insert = function(doc, cb) {
  connectThen(function(err, conn) {
    table.insert(doc).run(conn, cb);
  });
};

exports.getLatest = function(cb) {
  connectThen(function(err, conn) {
    table
        .group("name")
        .max("timestamp")
        .run(conn, cb);
  });
};

exports.latestPayload = function(cb) {
  step(
      function() {
        exports.getLatest(this);
      },
      function(err, results) {
        var payload = [];

        results.each(function(err, row) {
          payload.push(makePayload(row));
        }, function() {
          var _payload = {};
          payload.forEach(function(p) {
            _.merge(_payload, p);
          });
          cb(err, _payload);
        });

      }
  )
};

function makePayload(row) {
  var payload = {};
  var name = row.group.replace("-", "");
  var threshold = row.reduction.threshold;
  // @TODO not sure where to pull this from
  var alert = threshold < 60;

  payload[name + "threshold"] = threshold;
  payload[name + "alert"] = alert;

  return payload;
}
