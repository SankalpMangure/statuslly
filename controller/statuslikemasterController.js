const { json } = require("body-parser");
const db = require("../db/db");
const { StatuslikemasterModel } = require("../models/Statuslikemaster");

exports.statuslikemastertbl = async (req, res) => {
  let sql = `CREATE TABLE ${new StatuslikemasterModel().tablename}(
      ${Object.entries(new StatuslikemasterModel().data[0])
        .map((k) => k.toString().replace(",", " "))
        .join(", ")}   
    )`;
  db.query(sql, (err) => {
    if (err) {
      // throw err;
      res.json({ code: err.code, msg: err.sqlMessage });
    }
    let data = {
      code: 200,
      msg: `${new StatuslikemasterModel().tablename} table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

exports.likestatus = async (req, res) => {
  const data = req.body;
  // return res.send(data);
  // let userdata = {
  //   stslikeid: data.stslikeid,
  //   stsid: data.stsid,
  //   uid: data.uid,
  //   islike: data.islike,
  // };

  // let sql = `INSERT INTO ${new StatuslikemasterModel().tablename} SET ?`;
  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");
  // return res.json(JSON.parse(sdt));
  // let sql = `exec sp_statuslike @query='{"stslikeid":"0","stsid":"2","uid":"2","islike":"1"}',@mode=1`;
  let sql = `CALL sp_statuslike(?,?)`;
  db.query(sql, [sdt, data.mode], (err, result) => {
    if (err) {
      let data = {
        code: 500,
        msg: "Something went wrong! please try again",
        err: err,
      };
      return res.json(data);
    }
    if (!result) {
      let data = {
        code: 300,
        msg: "Something went wrong! please try again",
      };
      return res.json(data);
    } else {
      let resdata = {};
      if (data.mode == 1) {
        resdata = {
          code: 200,
          msg: "Status liked successfully",
        };
      } else if (data.mode == 3) {
        resdata = {
          code: 200,
          dt: result,
          msg: "Dislike successfully",
        };
      }
      return res.json(resdata);
    }
  });
};

exports.statusdislike = async (req, res) => {
  const data = req.body;
  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_statuslike(?,?)`;
  db.query(sql, [sdt, data.mode], (err, result) => {
    if (err) {
      let data = {
        code: 500,
        msg: "Something went wrong! please try again",
        err: err,
      };
      return res.json(data);
    }
    if (!result) {
      let data = {
        code: 300,
        msg: "Something went wrong! please try again",
      };
      return res.json(data);
    } else {
      let resdata = {};

      resdata = {
        code: 200,
        msg: "Status Dislike successfully",
      };

      return res.json(resdata);
    }
  });
};

exports.getstatuslike = async (req, res) => {
  let data = req.body;
  let whr = "";
  if (data.stsid > 0) {
    whr += ` and statuslikemaster.stsid = ${data.stsid}`;
  }
  if (data.uid > 0) {
    whr += ` and statuslikemaster.uid = ${data.uid}`;
  }
  if (!data.islike == "") {
    whr += ` and statuslikemaster.islike = ${data.islike}`;
  } else {
    whr += ` and statuslikemaster.islike = ${1}`;
  }
  data = {
    whr: whr,
  };
  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_statuslike(?,?)`;
  db.query(sql, [sdt, 4], (err, result) => {
    if (err) {
      let data = {
        code: 500,
        msg: "Something went wrong! please try again",
        err: err,
      };
      return res.json(data);
    }
    if (!result[0]) {
      let data = {
        code: 300,
        msg: "Data not found",
      };
      return res.json(data);
    } else {
      let resdata = {};
      let resdata1 = [];

      resdata = {
        code: 200,
        data: result[0],

        msg: "Data found successfully",
      };

      return res.json(resdata);
    }
  });
};
