const mysql = require("mysql");

//connection to mysql local
const db = mysql.createConnection({
  host: "localhost",
  // user: "statuslly22",
  user: "root",
  // password: "!_fYEm9=3?0(",
  password: "",
  database: "statuslly",
});
//connection to mysql local


//connection to mysql server
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "statuslly",
//   password: "so{f^b.j_y6(",
//   database: "statuslly",
// });
//connection to mysql server


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql Connected");
});

module.exports = db;
