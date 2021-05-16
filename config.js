const util = require("util");
const mysql = require("mysql");
// Database Credential
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
pool.getConnection((err, connection) => {
  if (err) console.log(err);
  else console.log("Connected to Database");
  if (connection) connection.release();
  return;
});
pool.query = util.promisify(pool.query);
module.exports = pool;
