const express = require("express");
const router = express.Router();
const taskRoutes = require("./task");

router.use("/api/tasks/", taskRoutes);

module.exports = router;