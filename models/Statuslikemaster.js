class StatuslikemasterModel {
  tablename = "statuslikemaster";
  data = [
    {
      stslikeid: "bigint AUTO_INCREMENT,PRIMARY KEY(stslikeid)",
      stsid: "bigint",
      uid: "bigint",
      islike: "int",
    },
  ];
}

module.exports = {
  StatuslikemasterModel,
};
