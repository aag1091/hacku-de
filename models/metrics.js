var r = require('rethinkdb');
var db = require('../db');
var connectThen = db.connectThen;
var rdb = db.rdb;
var tableName = 'metrics';

db.createTable(tableName);

var table = rdb.table(tableName);

exports.insert = function(doc, cb) {
  connectThen(function(err, conn) {
    table.insert(doc).run(conn, cb);
  });
};

