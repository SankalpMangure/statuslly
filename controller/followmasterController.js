const { json } = require("body-parser");
const db = require("../db/db");
const { FollowmasterModel } = require("../models/Followmaster");
const { execute_query } = require("../routes/globalroute");

exports.followmastertbl = async (req, res) => {
  let sql = `CREATE TABLE ${new FollowmasterModel().tablename}(
      ${Object.entries(new FollowmasterModel().data[0])
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
      msg: `${new FollowmasterModel().tablename} table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

exports.follow = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_followmaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 1);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    let retdata = JSON.parse(resdata[0][0].data);
    if (retdata.id <= 0) {
      const data1 = {
        code: 300,
        msg: "User allready in following",
      };

      return res.json(data1);
    }

    const data1 = {
      code: 200,
      msg: "Follow successfully",
    };

    return res.json(data1);
  }
};

exports.unfollow = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_followmaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 3);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Unfollow successfully",
    };

    return res.json(data1);
  }
};

exports.getfollowdetail = async (req, res) => {
  const data = req.body;
  let whr = "";
  if (data.isfollow <= 0) {
    whr += ` and followmaster.followuid = ${data.uid}`;
  } else {
    whr += ` and followmaster.followeruid = ${data.uid}`;
  }

  let data1 = {
    whr: whr,
    isfollow: data.isfollow,
  };
  let dt = JSON.stringify(data1);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_followmaster(?,?)`;
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
