class LoginModel {
  tablename = "login";
  data = [
    {
      uid: "bigint AUTO_INCREMENT,PRIMARY KEY(uid)",
      uname: "varchar(100)",
      mobileno: "varchar(12)",
      password: "varchar(250)",
      emailid: "varchar(100)",
      address: "text",
      city: "varchar(50)",
      state: "varchar(50)",
      country: "varchar(50)",
      isblock: "tinyint(5)",
      userpick: "text",
      otp: "int",
      tokan: "varchar(255)",
      latitude: "varchar(50)",
      longitude: "varchar(50)",
      isterms: "tinyint(5)",
      followcnt: "int",
      followercnt: "int",
    },
  ];
}

module.exports = {
  LoginModel,
};
