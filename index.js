const express = require("express");
const Routers = require("./routes/routes");
const createdb = require("./routes/globalroute");
var bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

const app = express();

const POST = process.env.POST || 4000;
// app.listen(4000, () => {
app.listen(POST, () => {
  console.log("connected to db & listening on port 4000");
});

// middleware
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/", Routers);
