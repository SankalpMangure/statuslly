const db = require("../db/db");
const { CommentmasterModel } = require("../models/Commetmaster");
const { execute_query } = require("../routes/globalroute");

exports.commentmastertbl = async (req, res) => {
  let sql = `CREATE TABLE ${new CommentmasterModel().tablename}(
      ${Object.entries(new CommentmasterModel().data[0])
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
      msg: `${new CommentmasterModel().tablename} table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

exports.addcomment = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_commentmaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 1);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Comment Save successfully",
    };

    return res.json(data1);
  }
};

exports.deletecmt = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_commentmaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 3);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Delete comment successfully",
    };

    return res.json(data1);
  }
};
exports.getcmtdetail = async (req, res) => {
  const data = req.body;
  let whr = "";
  if (data.cmtid > 0) {
    whr += ` and commentmaster.cmtid = ${data.cmtid}`;
  }
  if (data.stsid > 0) {
    whr += ` and commentmaster.stsid = ${data.stsid}`;
  }
  if (data.uid > 0) {
    whr += ` and commentmaster.uid = ${data.uid}`;
  }
  let data1 = {
    whr: whr,
  };
  let dt = JSON.stringify(data1);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_commentmaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 4);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    if (!resdata[0][0]) {
      const data1 = {
        code: 300,
        msg: "Data not found",
      };

      return res.json(data1);
    }
    const data1 = {
      code: 200,
      data: resdata[0],
      msg: "Data found successfully",
    };

    return res.json(data1);
  }
};
