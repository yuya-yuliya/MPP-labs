const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

Task = mongoose.model("Task");

class TaskService {
  constructor() {
    this.fileDirPath = path.join(
      path.dirname(require.main.filename),
      "public",
      "uploads"
    );
  }

  async getTasks() {
    return await Task.find();
  }

  async getTask(id) {
    return await Task.findById(id);
  }

  async addTask(task) {
    let matchTask = await Task.findOne(task);
    if (!matchTask) {
      const newTask = new Task(task);
      await newTask.save();
      task._id = newTask._id;
      return task;
    }

    return undefined;
  }

  async setTaskStatus(id, completed) {
    await Task.updateOne({ _id: id }, { $set: { completed: completed } });
  }

  async updateTask(task) {
    if (task.fileName) {
      await this.deleteFile(task._id);
    }

    await Task.updateOne({ _id: task._id }, { $set: task });
    return task;
  }

  async deleteTask(id) {
    await this.deleteFile(id);
    await Task.deleteOne({ _id: id });
  }

  async deleteFile(taskId) {
    let task = await Task.findById(taskId);
    if (task.realFileName != undefined) {
      fs.unlink(path.join(this.fileDirPath, task.realFileName), err => {});
    }

    await Task.updateOne(task, {
      $set: { fileName: undefined, realFileName: undefined }
    });
  }
}

module.exports = TaskService;
