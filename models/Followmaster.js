class FollowmasterModel {
  tablename = "followmaster";
  data = [
    {
      followid: "bigint AUTO_INCREMENT,PRIMARY KEY(followid)",
      followuid: "bigint ",
      followeruid: "bigint",
    },
  ];
}

module.exports = {
  FollowmasterModel,
};
