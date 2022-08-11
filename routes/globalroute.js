const db = require("../db/db");

const droptable = (tblname) => {
  let sql = `DROP TABLE if exists ${tblname}`;
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
  });
};
const createdb = () => {
  let sql = "CREATE DATABASE statuslly";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("statuslly Database created");
  });
};

const execute_query = (sql, sdt, mode) => {
  return new Promise((resolve, reject) => {
    try {
      db.query(sql, [sdt, mode], (err, result) => {
        if (err) {
          let data = {
            code: 500,
            msg: "Something went wrong! please try again",
            err: err,
          };
          resolve(data);
        }
        resolve(result);
      });
    } catch (error) {
      let data = {
        code: 600,
        msg: "Something went wrong! please try again",
        err: error,
      };
      resolve(data);
    }
  });
};

module.exports = { droptable, createdb, execute_query };
