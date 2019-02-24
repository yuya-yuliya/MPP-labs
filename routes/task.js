const express = require("express");
const router = express.Router();
const TaskService = require("../services/task.service");
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

router.get("/:id", async (request, response) => {
    let task = await taskService.getTask(request.params.id);
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

router.delete("/:id", async (request, response) => {
    await taskService.deleteTask(request.params.id);
    response.status(201).send({});
});

router.put("/:id", upload.single("attachedFile"), async (request, response) => {
    let oldTask = await taskService.getTask(request.params.id);
    let file = request.file || {
        filename: oldTask.fileName,
        originalname: oldTask.realFileName
    };
    let taskIsCompleted = ("true" == request.body.completedRadios);
    let task = {
        title: request.body.title,
        completed: taskIsCompleted,
        dueDate: new Date(request.body.dueDate),
        fileName: file.filename,
        realFileName: file.originalname
        };
    await taskService.updateTask(request.params.id, task);
    response.status(200).send({});
});

router.post("/", upload.single("attachedFile"), async (request, response) => {
    let file = request.file || {
        filename: undefined,
        originalname: undefined
    };
    let taskIsCompleted = ("true" == request.body.completedRadios);
    let task = {
        title: request.body.title,
        completed: taskIsCompleted,
        dueDate: new Date(request.body.dueDate),
        fileName: file.filename,
        realFileName: file.originalname
        };
    await taskService.addTask(task);    
    response.status(200).send({});
})

router.get("/", (request, response) => {
    response.render("task", {
        existed: false
    });
});

module.exports = router;