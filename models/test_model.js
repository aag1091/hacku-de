
var r = require('rethinkdb');
var db = require('../db');
var connectThen = db.connectThen;
var dbName = db.DB_NAME;
var tableName = 'test_table';

db.createTable(tableName);

exports.insert = function(docs, cb) {
  connectThen(function(err, conn) {
    return r.db(dbName).table(tableName).insert(docs).run(conn, cb);
  });
};

exports.getAll = function(cb) {
  connectThen(function(err, conn) {
    return r.db(dbName).table(tableName).run(conn, cb);
  });
};
