const express = require("express");
const router = express.Router();
const TaskService = require("../services/task.service");
const multer = require("multer");
const path = require("path");

const taskService = new TaskService();
const uploadsDirectory = path.join(
  path.dirname(require.main.filename),
  "public",
  "uploads"
);

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDirectory);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Get all tasks
router.get("/", async (request, response) => {
  let tasks = await taskService.getTasks();
  response.status(200).send(tasks);
});

// Get task by Id
router.get("/:id", async (request, response) => {
  let task = await taskService.getTask(request.params.id);
  if (task) {
    response.status(200).send(task);
  } else {
    response.status(404).send({});
  }
});

// Delete task
router.delete("/:id", async (request, response) => {
  await taskService.deleteTask(request.params.id);
  response.status(204).send({});
});

// Update task
router.put("/:id", upload.single("attachedFile"), async (request, response) => {
  let oldTask = await taskService.getTask(request.params.id);
  let file = request.file || {
    filename: oldTask.fileName,
    originalname: oldTask.realFileName
  };
  let taskIsCompleted = "true" == request.body.completed;
  let task = {
    _id: request.params.id,
    title: request.body.title,
    completed: taskIsCompleted,
    dueDate: request.body.dueDate,
    fileName: file.originalname,
    realFileName: file.filename
  };
  task = await taskService.updateTask(task);
  response.status(200).send(task);
});

// Add task
router.post("/", upload.single("attachedFile"), async (request, response) => {
  let file = request.file || {
    filename: undefined,
    originalname: undefined
  };
  let taskIsCompleted = "true" == request.body.completed;
  let task = {
    title: request.body.title,
    completed: taskIsCompleted,
    dueDate: request.body.dueDate,
    fileName: file.originalname,
    realFileName: file.filename
  };
  let addedTask = await taskService.addTask(task);
  response.status(201).send(addedTask);
});

// Set completed status
router.put("/:id/status/:completed", async (request, response) => {
  let completedFlag = request.params.completed == "true";
  await taskService.setTaskStatus(request.params.id, completedFlag);
  response.status(204).send({});
});

// Download file
router.get("/download/:fileName", (request, response) => {
  let filepath = path.join(uploadsDirectory, request.params.fileName);
  response.status(200).sendFile(filepath);
});

// Delete attached file
router.delete("/:id/removefile", async (request, response) => {
  await taskService.deleteFile(request.params.id);
  response.status(204).send({});
});

module.exports = router;
