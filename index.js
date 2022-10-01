const express = require("express");
const Routers = require("./routes/routes");
const createdb = require("./routes/globalroute");
var bodyParser = require("body-parser");

// const bcrypt = require("bcrypt");
require('dotenv').config({ path: __dirname + '/db/.env' })

const app = express();

const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT || 3000;
// <<<<<<< HEAD
// app.listen(PORT, () => {
// app.listen(4000, () => {
// =======
// app.listen(4000, () => {
app.listen(PORT, () => {
  // >>>>>>> 77544ed08e80eff88a6803168cffae2cd70d6a8c
  console.log("connected to db & listening on port 4000");
});

app.get("/", function (req, res) {
  res.send("Shree gurudev datta a");
  console.log("shree mahalaxmi");
  res.end();
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
