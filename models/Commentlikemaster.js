class CommentlikemasterModel {
  tablename = "commentlikemaster";
  data = [
    {
      cmtlikeid: "bigint AUTO_INCREMENT,PRIMARY KEY(cmtlikeid)",
      cmtid: "bigint",
      uid: "bigint",
      islike: "int",
    },
  ];
}

module.exports = {
  CommentlikemasterModel,
};
