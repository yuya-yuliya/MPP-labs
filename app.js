require("./models/Task");
require("./models/User");
require("dotenv").config();

const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const http = require("http");
const socketIo = require("socket.io");

const setupSocket = require("./routes/sockets");

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

const server = http.createServer(app);

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

const io = socketIo(server, { path: "/socket/tasks" });

setupSocket(io);

server.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
