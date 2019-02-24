const express = require("express");
const router = express.Router();
const taskRoutes = require("./task");
const TaskService = require("../services/task.service");

const taskService = new TaskService();

router.use("/task/", taskRoutes);

router.get("/", (request, response) => {
    let completedFilter;
    let tasks = taskService.getTasks();
    if (request.query.completedFilter && (request.query.completedFilter != "All")) {
        filter = request.query.completedFilter == "Completed";
        tasks = tasks.filter(
            val => val.completed === filter
        );
    }

    response.status(200).render("index", {
        tasks: tasks,
        completedFilter: completedFilter
    });
});

module.exports = router;