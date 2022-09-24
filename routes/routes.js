const express = require("express");
const CommentlikemasterController = require("../controller/commentlikemasterController");
const CommentmasterController = require("../controller/commentmasterController");
const CommentreplaymasterController = require("../controller/commentreplaymasterController");
const followmasterController = require("../controller/followmasterController");

const PolicemasterController = require("../controller/policemasterController");
const StatuslikemasterController = require("../controller/statuslikemasterController");
const StatusmasterController = require("../controller/statusmasterController");
var myfunc = require("../controller/smaple");
const LoginController = require("../controller/loginControll");
const router = express.Router();

var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//GET all workouts
// router.get("/createdb", LoginController.crea);
router.get("/logintbl", LoginController.logintbl);
router.post("/userblock", LoginController.userblock);
router.post("/signup", LoginController.signup);
// router.post("/signin", LoginController.signin);
router.post("/signin", LoginController.signup);
router.post("/verifyotp", LoginController.verifyotp);
router.post("/getuserdetail", LoginController.getuserdetail);
router.post("/getuserdata", LoginController.getuserdetail);
router.post("/updateprofile", LoginController.updateprofile);
router.post("/getuser_latlong", LoginController.getuserdetail);
router.post("/search_user", LoginController.getuserdetail);
router.post("/updateprofile_pic",LoginController.updateprofile_pic);
router.post("/deleteuserimage",LoginController.deleteuserimage);

router.get("/statustbl", StatusmasterController.statusmastertbl);
router.post("/create_new_status", StatusmasterController.create_new_status);
router.post("/stsviewutp", StatusmasterController.isviewcnt);
router.post("/del_status", StatusmasterController.deletestatus);
router.post("/get_userstatus_det", StatusmasterController.get_userstatus_det);
router.get("/getalluser_status", StatusmasterController.getalluser_status);
router.post("/status_det", StatusmasterController.getalluser_status);
router.post("/insertstatus",StatusmasterController.insertstatus);
router.post("/createnewstatusmaster",StatusmasterController.create_new_statusmaster);

router.post("/set_likeviewcnt", StatuslikemasterController.set_likeviewcnt);
router.post("/dislikestatus", StatuslikemasterController.statusdislike);
router.post("/getstatuslike", StatuslikemasterController.getstatuslike);
router.post("/get_lslike_status", StatuslikemasterController.get_lslike_status);

router.get("/statusliketbl", StatuslikemasterController.statuslikemastertbl);

router.get("/commenttbl", CommentmasterController.commentmastertbl);

router.post("/savecomment", CommentmasterController.addcomment);
router.post("/deletecmt", CommentmasterController.deletecmt);
router.post("/getcmtdetail", CommentmasterController.getcmtdetail);
router.post("/get_status_comment", CommentmasterController.getcmtdetail);

router.get("/commentliketbl", CommentlikemasterController.commentmastertbl);
router.post("/savecomment_like", CommentlikemasterController.addcommentlike);
router.post("/commentdislike", CommentlikemasterController.commentdislike);
router.post("/getcmtlikedetail", CommentlikemasterController.getcmtlikedetail);

router.get(
  "/commentrplytbl",
  CommentreplaymasterController.commentreplaymastertbl
);
router.post("/commentrply", CommentreplaymasterController.addcommentrply);
router.post("/delcommentrply", CommentreplaymasterController.deletecommentrply);
router.post(
  "/getcmtrplydetail",
  CommentreplaymasterController.getcmtrplydetail
);

router.get("/followtbl", followmasterController.followmastertbl);
router.post("/follow", followmasterController.follow);
router.post("/unfollow", followmasterController.unfollow);
router.post("/getfollowdetail", followmasterController.getfollowdetail);
router.post("/following", followmasterController.following);

router.get("/policetbl", PolicemasterController.policemastertbl);
router.post("/savereport", PolicemasterController.savereport);
router.post("/deletereport", PolicemasterController.deletereport);
router.post("/getreportdetail", PolicemasterController.getreportdetail);

module.exports = router;
