const express = require("express");
const router = express.Router();
const schema = require("./graphQL/schema");
const jwt = require("express-jwt");
require('dotenv').config();

// Auth middleware
const auth = jwt({
  secret: process.env.SECRET,
  credentialsRequired: false
});

router.use("/", auth);
schema.applyMiddleware({
  app: router,
  path: "/"
});

module.exports = router;
