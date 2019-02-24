const path = require("path");
const mongoose = require("mongoose");

Task = mongoose.model("Task");

class TaskService {
    constructor() {
        this.fileDirPath = path.join(__dirname, "private");
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
        }
    }

    async setTaskStatus(id, completed) {
        await Task.updateOne({ _id: id }, { completed: completed });
    }

    async updateTask(id, task) {
        await Task.updateOne({ _id: id }, task);
    }

    async deleteTask(id) {
        await Task.deleteOne({ _id: id });
    }
}

module.exports = TaskService;