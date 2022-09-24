const { json } = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const db = require("../db/db");
const { StatusmasterModel } = require("../models/Statusmaster");


const {
  execute_query,
  imgupload,
  imgdelete,

} = require("../routes/globalroute");

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

exports.create_new_status  = async (request, response) => {
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
        status: fname,
        media_type: temp_file_type,
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
              "" + element.img;

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

exports.create_new_statusmaster  = async (req, res) => {
  let stslink = {};
  let stslinkArray = [];
  let data = req.body;
  // console.log(data.img[0].file);
  let imgdata = imgupload(data.statuslink, "Uploads/Status/");
  var d = new Date();

  var yesterday = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
   data = {
    stsid: "0",
    uid: "3",
    statuslink: JSON.stringify(imgdata),
    isviewcnt: "0",
    islikecnt: "0",
    edate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    expdate: `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()} ${yesterday.getHours()}:${yesterday.getMinutes()}`,
    remark: req.body.remark,
    ismaster: "1",
  };
  let sql = `INSERT INTO ${new StatusmasterModel().tablename} SET ?`;
  db.query(sql, data, (err, result) => {
    if (err) {
      let data = {
        code: 500,
        msg: "Something went wrong! please try again",
        error: err,
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
      let data = {
        code: 200,
        msg: "Status submitted successfully",
      };
      return res.json(data);
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
  this.deletestatusimg(data.stsid); 
  let sql = `CALL sp_stausmaster(?,?)`;
  db.query(sql, [sdt, 3], (err, result) => {
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
exports.deletestatusimg = async (stsid) => {
   
  let data ={} ;
  let whr = "";
    whr += ` and statusmaster.stsid = ${stsid}`;
  
  
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
      return false;
    }
    if (!result[0]) {
      let data = {
        code: 300,
        msg: "Data not found",
      };
      return false;
    } else {
      // console.log(result[0]);
      let resdata = JSON.parse(result[0][0].statuslink);
      let resdata1 = [];
      resdata.forEach((element) => {
        // console.log(element);
        // imgdelete("./Uploads/Status/"+ element.status);
        let statuslink= element.status;
        statuslink= statuslink.replace("Uploads/Status/","")
        imgdelete("./Uploads/Status/"+ statuslink);
      });
      resdata = {
        code: 200,
        data: resdata1,

        msg: "Data found successfully",
      };

      return true;
    }
  });
};

exports.get_userstatus_det = async (req, res) => {
  let data = req.body;
  let whr = "";
  if (data.stsid > 0) {
    whr += ` and statusmaster.stsid = ${data.stsid}`;
  }
  if (data.id > 0) {
    whr += ` and statusmaster.uid = ${data.id}`;
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
        let edate=new Date(element.edate);
        edate=`${edate.getDate()}/${edate.getMonth()+1}/${edate.getFullYear()}`
        resdata1.push({
          id: element.stsid,
          likecnt: element.isviewcnt,
          viewcnt: element.islikecnt,
          uid: element.uid,
          remark: element.remark,
          created_date:edate,
          created_date_det:edate,
          profilepic: userpic,
          statuslink: JSON.parse(element.statuslink),                                                
        });
      });
       if(resdata1.length <= 0){
        resdata = {
          code: 300,
          data: resdata1,
  
          msg: "Data not found",
        };
  
        return res.json(resdata);
      }
      resdata = {
        code: 200,
        data: resdata1,

        msg: "Data found successfully",
      };

      return res.json(resdata);
    }
  });
};
exports.getalluser_status = async (req, res) => {
  let data = req.body;
//   const uid = req.params.uid;
  let whr = "";
  if (data.stsid > 0) {
    whr += ` and statusmaster.stsid = ${data.stsid}`;
  }
  if (data.uid > 0) {
    whr += ` and statusmaster.uid != ${data.uid}`;
  }
   if (data.ismaster == 1) {
    whr += ` and statusmaster.ismaster = ${data.ismaster}`;
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
        let edate=new Date(element.edate);
        edate=`${edate.getDate()}/${edate.getMonth()+1}/${edate.getFullYear()}`;
        let islike=0,isview=0,isfollow=0;
        if (!element.followcnt > 0) {
          isfollow=1;
        }
        if (!element.islikecnt > 0) {
          isview=1;
        }
        if (!element.isviewcnt > 0) {
          islike=1;
        }
        resdata1.push({
          id: element.stsid,
          likecnt: element.isviewcnt,
          viewcnt: element.islikecnt,
          islike:islike,
          isview:isview,
          isfollow:isfollow,
          uid: element.uid,
          remark: element.remark,
          uname:element.uname,
          created_date:edate,
          created_date_det:edate,
          profilepic: userpic,
          statuslink: JSON.parse(element.statuslink),                                                
        });
      });
       if(resdata1.length<=0){
        resdata = {
          code: 300,
          msg: "Data not found",
        };
        return res.json(resdata);
      }
      resdata = {
        code: 200,
        data: resdata1,

        msg: "Data found successfully",
      };

      return res.json(resdata);
    }
  });
};


exports.insertstatus = async (req, res, next) => {
  const data = req.body;
  // console.log(data.img[0].file);
  let statuslink = imgupload(data.statuslink, "uploads/Status/");
  let data2 = {
    stsid: data.stsid,
    uid: data.uid,
    statuslink: statuslink,
    islikecnt: data.islikecnt,
    edate: data.edate,
    expdate: data.expdate,
    remark: data.remark,
    ismaster: data.ismaster,
  };

  let dt = JSON.stringify(data2);
  let sdt = dt.replace(/\\/g, "");
  let sql = `CALL sp_stausmaster(?,?)`;
  const resdata = await execute_query(sql, sdt, 5);

  if (resdata.code == 500) {
    return res.json(resdata);
  } else {
    const data1 = {
      code: 200,
      msg: "Record saved successfully",
    };

    return res.json(data1);

    // return res.send("sopmething response");
  }
};