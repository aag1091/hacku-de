var r = require('rethinkdb');
var step = require('step');
var _ = require('lodash');

var DB_NAME = 'ross';

var conn = null;

function connect() {
  if(conn) {
    return conn;
  } else {
    r.connect({host: 'localhost', port: 28015}, this);
  }
}

function listDbs(err, connection) {
  conn = connection;
  r.dbList().run(connection, this);
}

function createDb(err, dbs) {
  if(!_.contains(dbs, DB_NAME)) {
    r.dbCreate(DB_NAME).run(conn, this);
  } else {
    console.log('Database exists.');
  }
}

step(connect, listDbs, createDb);

exports.rdb = r.db(DB_NAME);

exports.connectThen = function(cb) {
  step(connect, cb);
};

exports.createTable = function(tableName) {
  step(
      connect,
      function listTables(err, connection) {
        conn = connection;
        r.db(DB_NAME).tableList().run(conn, this);
      },
      function createTable(err, tables) {
        if(!_.contains(tables, tableName)) {
          r.db(DB_NAME).tableCreate(tableName).run(conn, this);
        } else {
          console.log('Table ' + tableName + ' exists')
        }
      },
      function(err, result) {
        if(err) throw err;
        console.log('Table ' + tableName + ' created');
      }
  );
};

