const db = require("../db/db");
const { PolicemasterModel } = require("../models/Policemaster");
const { execute_query } = require("../routes/globalroute");

exports.policemastertbl = async (req, res) => {
  let sql = `CREATE TABLE ${new PolicemasterModel().tablename}(
      ${Object.entries(new PolicemasterModel().data[0])
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
      msg: `${new PolicemasterModel().tablename} table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

exports.savereport = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_policemaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 1);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Report Submitted successfully",
    };

    return res.json(data1);
  }
};

exports.deletereport = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_policemaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 3);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Report Deleted successfully",
    };

    return res.json(data1);
  }
};

exports.getreportdetail = async (req, res) => {
  const data = req.body;
  let whr = "";
  if (data.policeid > 0) {
    whr += ` and policemastermaster.policeid = ${data.policeid}`;
  }
  if (data.reportuid > 0) {
    whr += ` and policemastermaster.reportuid = ${data.reportuid}`;
  }
  if (data.stsid > 0) {
    whr += ` and policemastermaster.uid = ${data.policeid}`;
  }
  let data1 = {
    whr: whr,
  };
  let dt = JSON.stringify(data1);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_policemaster(?,?)`;
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
    let arr = [];

    resdata[0].forEach((element) => {
      let statusdata = element.statusdata;
      delete element.statusdata;
      Object.assign(element, JSON.parse(statusdata));
      arr.push(element);
    });
    // arr = resdata[0].filter(!statusdata);
    const data1 = {
      code: 200,
      data: arr,
      msg: "Data found successfully",
    };

    return res.json(data1);
  }
};
