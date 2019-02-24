const express = require("express");
const router = express.Router();
const TaskService = require("../services/task.service");
const Task = require("../models/task");
const multer = require("multer");

const taskService = new TaskService();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "public/uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.get("/:id", (request, response) => {
    let task = taskService.getTask(request.params.id);
    if (task) {
        response.status(200).render("task", {
            existed: true,
            task: task
        });
    }
    else {
        response.redirect(404, request.baseUrl);
    }
});

router.delete("/:id", (request, response) => {
    taskService.deleteTask(request.params.id);
    response.status(201).send({});
});

router.put("/:id", upload.single("attachedFile"), (request, response) => {
    let oldTask = taskService.getTask(request.params.id);
    let file = request.file || {
        filename: oldTask.fileName,
        originalname: oldTask.realFileName
    };
    let taskIsCompleted = ("true" == request.body.completedRadios);
    let task = new Task(0, request.body.title, taskIsCompleted, request.body.dueDate, file.filename, file.originalname);
    taskService.updateTask(request.params.id, task);
    response.status(200).send({});
});

router.post("/", upload.single("attachedFile"), (request, response) => {
    let file = request.file || {
        filename: undefined,
        originalname: undefined
    };
    let taskIsCompleted = ("true" == request.body.completedRadios);
    let task = new Task(0, request.body.title, taskIsCompleted, request.body.dueDate, file.filename, file.originalname);
    taskService.addTask(task);    
    response.status(200).send({});
})

router.get("/", (request, response) => {
    response.render("task", {
        hasAlert: false,
        existed: false
    });
});

module.exports = router;