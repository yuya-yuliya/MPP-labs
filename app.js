require("./models/Task");
require("dotenv").config();

const express = require("express");
const path = require("path");
const routes = require("./routes/index");
const layouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection
  .on("connected", () => {
    console.log(`Mongoose connection open on ${process.env.DATABASE}`);
  })
  .on("error", err => {
    console.log(`Connection error: ${err.message}`);
  });

const app = express();

app.use(cors());
app.use(layouts);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
