class StatusmasterModel {
  tablename = "statusmaster";
  data = [
    {
      stsid: "bigint AUTO_INCREMENT,PRIMARY KEY(stsid)",
      uid: "bigint",
      statuslink: "text",
      isviewcnt: "int",
      islikecnt: "int",
      edate: "datetime",
      expdate: "datetime",
      remark: "text",
      ismaster: "tinyint(5)",
    },
  ];
}

module.exports = {
  StatusmasterModel,
};
