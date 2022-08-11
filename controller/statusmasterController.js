const { json } = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const db = require("../db/db");
const { StatusmasterModel } = require("../models/Statusmaster");

exports.statusmastertbl = async (req, res) => {
  let sql = `CREATE TABLE ${new StatusmasterModel().tablename}(
      ${Object.entries(new StatusmasterModel().data[0])
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
      msg: `${new StatusmasterModel().tablename} table created successfuly`,
      data: [],
    };
    res.json(data);
  });
};

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Uploads/Status");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const filedelete = (imgpath) => {
  return new Promise((resolve, reject) => {
    try {
      fs.unlink(imgpath, function (err) {
        if (err) {
          resolve(err);
        }
        resolve(true);
        // if no error, file has been deleted successfully
      });
    } catch (error) {
      resolve(false);
    }
  });
};

exports.savestatus = async (request, response) => {
  let stslink = {};
  let stslinkArray = [];

  var storage = multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, "./Uploads/Status");
    },
    filename: function (request, file, callback) {
      var temp_file_arr = file.originalname.split(".");
      var temp_file_type = file.mimetype;
      var temp_file_name = `status_`;

      var temp_file_extension = temp_file_arr[1];
      var fname = temp_file_name + "" + Date.now() + "." + temp_file_extension;
      callback(
        null,
        temp_file_name + "" + Date.now() + "." + temp_file_extension
      );
      stslink = {
        id: Date.now(),
        img: fname,
        type: temp_file_type,
      };
      stslinkArray.push(stslink);
    },
  });

  var upload = multer({ storage: storage, uid: "2" }).array("file[]");
  var yesterday = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  upload(request, response, function (error) {
    if (error) {
      let data = {
        code: 300,
        msg: "Something went wrong! please try again",
      };
      return res.json(data);
    } else {
      var d = new Date();
      let data = {
        stsid: "0",
        uid: request.body.uid,
        statuslink: JSON.stringify(stslinkArray),
        isviewcnt: "0",
        islikecnt: "0",
        edate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
        expdate: `${yesterday.getFullYear()}-${
          yesterday.getMonth() + 1
        }-${yesterday.getDate()} ${yesterday.getHours()}:${yesterday.getMinutes()}`,
        remark: request.body.remark,
        ismaster: "0",
      };

      let sql = `INSERT INTO ${new StatusmasterModel().tablename} SET ?`;
      db.query(sql, data, (err, result) => {
        if (err) {
          stslinkArray.forEach((element) => {
            var imgpath =
              "http://192.168.29.7:4000/Uploads/Status/" + element.img;

            fs.unlink(imgpath, function (err) {
              if (err) {
                return response.json(err);
              }
              // if no error, file has been deleted successfully
            });
          });
          let data = {
            code: 500,
            msg: "Something went wrong! please try again",
            error: err,
          };
          return response.json(data);
        }
        if (!result) {
          let data = {
            code: 300,
            msg: "Something went wrong! please try again",
          };
          return response.json(data);
        } else {
          let data = {
            code: 200,
            msg: "Status submitted successfully",
          };
          return response.json(data);
        }
      });
    }
  });
};

exports.isviewcnt = async (req, res) => {
  const data = req.body;
  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_stausmaster(?,?)`;
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
        msg: "status viewed successfully",
      };

      return res.json(resdata);
    }
  });
};

exports.deletestatus = async (req, res) => {
  const data = req.body;
  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_stausmaster(?,?)`;
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
        msg: "status deleted successfully",
      };

      return res.json(resdata);
    }
  });
};

exports.getstatus = async (req, res) => {
  let data = req.body;
  let whr = "";
  if (data.stsid > 0) {
    whr += ` and statusmaster.stsid = ${data.stsid}`;
  }
  if (data.uid > 0) {
    whr += ` and statusmaster.uid = ${data.uid}`;
  }
  data = {
    whr: whr,
  };
  let dt = JSON.stringify(data);
  let sdt = dt.replace(/\\/g, "");

  let sql = `CALL sp_stausmaster(?,?)`;
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
      result[0].forEach((element) => {
        let userpic = element.userpic;
        if (!element.userpic == null) {
          userpic = JSON.parse(element.userpic);
        }
        resdata1.push({
          stsid: element.stsid,
          uid: element.uid,
          statuslink: JSON.parse(element.statuslink),
          isviewcnt: element.isviewcnt,
          islikecnt: element.islikecnt,
          edate: element.edate,
          expdate: element.expdate,
          remark: element.remark,
          ismaster: element.ismaster,
          uname: element.uname,
          mobileno: element.mobileno,
          address: element.address,
          state: element.state,
          city: element.city,
          userpic: userpic,
        });
      });
      resdata = {
        code: 200,
        data: resdata1,

        msg: "Data found successfully",
      };

      return res.json(resdata);
    }
  });
};
