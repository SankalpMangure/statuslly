class PolicemasterModel {
  tablename = "policemastermaster";
  data = [
    {
      policeid: "bigint AUTO_INCREMENT,PRIMARY KEY(policeid)",
      reportuid: "bigint ",
      stsid: "bigint",
      report: "text",
    },
  ];
}

module.exports = {
  PolicemasterModel,
};
