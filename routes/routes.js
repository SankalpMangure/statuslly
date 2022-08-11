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
router.post("/signin", LoginController.signin);
router.post("/verifyotp", LoginController.verifyotp);
router.post("/getuserdetail", LoginController.getuserdetail);

router.get("/statustbl", StatusmasterController.statusmastertbl);
router.post("/savestatus", StatusmasterController.savestatus);
router.post("/stsviewutp", StatusmasterController.isviewcnt);
router.post("/stsdelete", StatusmasterController.deletestatus);
router.post("/getstatus", StatusmasterController.getstatus);

router.post("/likestatus", StatuslikemasterController.likestatus);
router.post("/dislikestatus", StatuslikemasterController.statusdislike);
router.post("/getstatuslike", StatuslikemasterController.getstatuslike);

router.get("/statusliketbl", StatuslikemasterController.statuslikemastertbl);

router.get("/commenttbl", CommentmasterController.commentmastertbl);
router.post("/addcomment", CommentmasterController.addcomment);
router.post("/deletecmt", CommentmasterController.deletecmt);
router.post("/getcmtdetail", CommentmasterController.getcmtdetail);

router.get("/commentliketbl", CommentlikemasterController.commentmastertbl);
router.post("/addcommentlike", CommentlikemasterController.addcommentlike);
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

router.get("/policetbl", PolicemasterController.policemastertbl);
router.post("/savereport", PolicemasterController.savereport);
router.post("/deletereport", PolicemasterController.deletereport);
router.post("/getreportdetail", PolicemasterController.getreportdetail);

module.exports = router;
