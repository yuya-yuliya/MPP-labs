const express = require("express");
const path = require("path");
const routes = require("./routes/index");
const layouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const app = express();

app.use(layouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});