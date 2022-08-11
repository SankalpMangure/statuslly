const db = require("../db/db");
const { CommentreplaymasterModel } = require("../models/Commentreplaymaster");
const { execute_query } = require("../routes/globalroute");

exports.commentreplaymastertbl = async (req, res) => {
  let sql = `CREATE TABLE ${new CommentreplaymasterModel().tablename}(
      ${Object.entries(new CommentreplaymasterModel().data[0])
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
      msg: `${
        new CommentreplaymasterModel().tablename
      } table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

exports.addcommentrply = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_commentreplaymaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 1);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Comment replay successfully",
    };

    return res.json(data1);
  }
};

exports.deletecommentrply = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_commentreplaymaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 3);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Comment replay delete successfully",
    };

    return res.json(data1);
  }
};

exports.getcmtrplydetail = async (req, res) => {
  const data = req.body;
  let whr = "";
  if (data.cmtlikeid > 0) {
    whr += ` and commentreplaymaster.cmtrplyeid = ${data.cmtrplyid}`;
  }
  if (data.cmtid > 0) {
    whr += ` and commentreplaymaster.cmtid = ${data.cmtid}`;
  }
  if (data.uid > 0) {
    whr += ` and commentreplaymaster.uid = ${data.uid}`;
  }
  let data1 = {
    whr: whr,
  };
  let dt = JSON.stringify(data1);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_commentreplaymaster(?,?)`;
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
