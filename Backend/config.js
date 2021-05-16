var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");

var queryDB = function (sql, params) {
  var that = this;
  return new Promise(function (resolve, reject) {
    db.all(sql, params, function (error, rows) {
      if (error) reject(error);
      else resolve(rows);
    });
  });
};

module.exports = queryDB;
