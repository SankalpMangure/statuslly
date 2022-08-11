class CommentmasterModel {
  tablename = "commentmaster";
  data = [
    {
      cmtid: "bigint AUTO_INCREMENT,PRIMARY KEY(cmtid)",
      stsid: "bigint ",
      uid: "bigint",
      cmt: "text",
      islikecnt: "int",
    },
  ];
}

module.exports = {
  CommentmasterModel,
};
