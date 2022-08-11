const db = require("../db/db");
const { LoginModel } = require("../models/Login");
const { droptable, execute_query } = require("../routes/globalroute.js");
var unirest = require("unirest");
const { response } = require("express");

exports.createdb = () => {
  let sql = "CREATE DATABASE statuslly";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    let data = [
      {
        code: 200,
        msg: `Database created successfuly`,
        data: [],
      },
    ];
    res.send(json(data));
  });
};

exports.logintbl = async (req, res) => {
  let sql = `CREATE TABLE ${new LoginModel().tablename}(
    ${Object.entries(new LoginModel().data[0])
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
      msg: `${new LoginModel().tablename} table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

const sendotp = (mob, otp) => {
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
  return new Promise((resolve, reject) => {
    try {
      req.query({
        authorization:
          "90wh7iyJdGq55lSutgdIPI0SmkTB7cUCxHvLpgK7Zcv3AMPG3kNPGV1vz6L8",
        variables_values: `${otp}|2`,
        route: "dlt",
        sender_id: "STSLLY",
        flash: 0,
        message: "141008",
        numbers: `${mob}`,
      });

      req.headers({
        "cache-control": "no-cache",
      });

      req.end(function (res) {
        resolve(res.body);
      });
    } catch (error) {
      reject(false);
    }
  });
};

const genotp = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const checkmobno = (mob) => {
  let sql = `Select * from ${new LoginModel().tablename} where 1=1`;
  sql += ` and mobileno='${mob}'`;
  return new Promise((resolve, reject) => {
    try {
      db.query(sql, (err, result) => {
        if (err) {
          resolve(300);
        }
        resolve(result);
      });
    } catch (error) {
      resolve(300);
    }
  });
};
exports.signup = async (req, res) => {
  const data = req.body;
  let generateotp = genotp(1111, 9999);
  const verifyotp = await sendotp(data.mobileno, generateotp);
  if (verifyotp == false) {
    let data = {
      code: 300,
      msg: "something went wrong!please try again",
    };
    return res.json(data);
  } else if (verifyotp.return == false) {
    let data = {
      code: 300,
      msg: verifyotp.message,
    };
    return res.json(data);
  }
  const checkmob = await checkmobno(data.mobileno);

  if (checkmob[0]?.uid > 0) {
    let data = {
      code: 300,
      msg: "User allready exists",
    };
    return res.json(data);
  } else if (checkmob == 300) {
    let data = {
      code: 300,
      msg: "Something went wrong! please try again",
    };
    return res.json(data);
  }

  let userdata = {
    mobileno: data.mobileno,
    otp: generateotp,
    country: "India",
    isterms: "1",
    isblock: "0",
  };
  let sql = `INSERT INTO ${new LoginModel().tablename} SET ?`;
  db.query(sql, userdata, (err, result) => {
    if (err) {
      throw err;
    }
    if (!result) {
      let data = {
        code: 300,
        msg: "please insert all fields",
      };
      return res.json(data);
    } else {
      let data = {
        code: 200,
        msg: "Sign Up successfully",
      };
      return res.json(data);
    }
  });
};

exports.signin = async (req, res) => {
  const data = req.body;

  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_login(?,?)`;
  const resdata = await execute_query(sql, sdt, 5);
  if (resdata.code == 500) {
    return res.json(resdata);
  } else if (resdata.code == 600) {
    return res.json(resdata);
  } else {
    if (resdata[0][0].isblock == -1) {
      const data1 = {
        code: 400,
        msg: "Please signup first!",
      };

      return res.json(data1);
    } else if (resdata[0][0].isblock == 1) {
      const data1 = {
        code: 300,
        msg: "You are blocked, please contact your administrator",
      };

      return res.json(data1);
    } else {
      let generateotp = genotp(1111, 9999);
      const verifyotp = await sendotp(data.mobileno, generateotp);
      const otpdata = {
        mobileno: data.mobileno,
        otp: generateotp,
      };
      let dt = JSON.stringify(otpdata);
      let sdt = dt.replace(/\\/g, "");
      const otpupdt = await execute_query(sql, sdt, 6);
      const data1 = {
        code: 200,
        msg: "Sign In Successfully",
      };

      return res.json(data1);
    }
  }
};

exports.verifyotp = async (req, res) => {
  const data = req.body;
  let sql = `Select * from ${new LoginModel().tablename} where 1=1`;
  sql += ` and mobileno='${data.mobileno}'`;
  sql += ` and otp='${data.otp}'`;

  db.query(sql, (err, result) => {
    if (err) {
      let data = {
        code: 300,
        msg: `Something went wrong! please try again`,
      };
      res.send(json(data));
    }
    if (result[0]?.uid > 0) {
      let data = {
        code: 200,
        msg: "Account verified successfully",
        data: [
          {
            mobileno: result[0].mobileno,
            uid: result[0].uid,
            isblock: result[0].isblock,
          },
        ],
      };
      return res.json(data);
    } else {
      let data = {
        code: 300,
        msg: "Invalid otp",
      };
      return res.json(data);
    }
  });
};

exports.userblock = async (req, res) => {
  const data = req.body;
  let whr = "";
  if (data.uid > 0) {
    whr += ` and login.uid = ${data.uid}`;
  }
  let data1 = {
    whr: whr,
    isblock: data.isblock,
    uid: data.uid,
  };

  let dt = JSON.stringify(data1);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_login (?,?)`;
  db.query(sql, [sdt, 1], (err, result) => {
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
        msg: "User Block status Updated successfully",
      };

      return res.json(resdata);
    }
  });
};

exports.getuserdetail = async (req, res) => {
  const data = req.body;
  let whr = "";
  if (data.uid > 0) {
    whr += ` and uid = ${data.uid}`;
  }
  if (data.uname > 0) {
    whr += ` and uname like '%${data.uname}%'`;
  }
  if (data.isblock > 0) {
    whr += ` and isblock = ${data.isblock}`;
  }
  if (data.mobileno > 0) {
    whr += ` and mobileno = '${data.mobileno}'`;
  }
  if (!data.emailid == "") {
    whr += ` and emailid = '${data.emailid}'`;
  }
  if (!data.search == "") {
    whr += ` and city = '${data.search}'`;
    whr += ` or state = '${data.search}'`;
    whr += ` or country = '${data.search}'`;
  }
  let data1 = {
    whr: whr,
  };
  let dt = JSON.stringify(data1);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_login(?,?)`;
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
