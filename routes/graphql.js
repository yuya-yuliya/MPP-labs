const express = require("express");
const router = express.Router();
const taskSchema = require("./graphQL/taskSchema");
const userSchema = require("./graphQL/userSchema");
const jwt = require("express-jwt");

// Auth middleware
const auth = jwt({
  secret: process.env.SECRET,
  credentialsRequired: false
});

router.use("/", auth);
userSchema.applyMiddleware({
    app: router,
    path: "/user"
});
taskSchema.applyMiddleware({
    app: router,
    path: "/task"
});

module.exports = router;
