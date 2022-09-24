const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  // user: "statuslly22",
  user: "root",
  // password: "!_fYEm9=3?0(",
  password: "",
  database: "statuslly",
});

//connection to mysql

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql Connected");
});

module.exports = db;
