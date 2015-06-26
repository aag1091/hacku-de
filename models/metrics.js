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

exports.insert = function (doc, cb) {
  connectThen(function (err, conn) {
    table.insert(doc).run(conn, cb);
  });
};

exports.getLatest = function (company, cb) {
  connectThen(function (err, conn) {
    table
        .filter(
        r.row("name").match("^" + company)
    )
        .group("name")
        .max("timestamp")
        .run(conn, cb);
  });
};

exports.latestPayload = function (company, cb) {
  step(
      function () {
        exports.getLatest(company, this);
      },
      function (err, results) {
        var payload = [];

        results.each(function (err, row) {
          payload.push(makePayload(company, row));
        }, function () {
          var _payload = {};
          payload.forEach(function (p) {
            _.merge(_payload, p);
          });
          cb(err, _payload);
        });
      }
  )
};

function makePayload(company, row) {
  var payload = {};
  var regx = new RegExp(company + "|-", "g");
  var name = row.group.replace(regx, "");
  var threshold = row.reduction.threshold;
  var alert = row.reduction.alert;

  payload[name + "threshold"] = threshold;
  payload[name + "alert"] = alert;

  return payload;
}
