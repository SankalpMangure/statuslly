class CommentreplaymasterModel {
  tablename = "commentreplaymaster";
  data = [
    {
      cmtrplyid: "bigint AUTO_INCREMENT,PRIMARY KEY(cmtrplyid)",
      cmtid: "bigint",
      uid: "bigint",
      iscmtrply: "text",
    },
  ];
}

module.exports = {
  CommentreplaymasterModel,
};
