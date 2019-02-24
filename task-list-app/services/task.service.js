const Task = require("../models/task");
const path = require("path");
const moment = require("moment");

let Tasks = [
    new Task(0, "Task 1", false, moment(new Date()).format("YYYY-MM-DD"), "file.txt", "file.txt"),
    new Task(1, "Task 2", true, moment(new Date()).format("YYYY-MM-DD"), "", ""),
    new Task(2, "Task 3", false, moment(new Date()).format("YYYY-MM-DD"), "", "")
];

class TaskService {
    constructor() {
        this.fileDirPath = path.join(__dirname, "private");
    }

    getTasks() {
        Tasks.forEach((element, index) => {
            element.id = index;
        });
        return Tasks;
    }

    getTask(id) {
        let task = Tasks[id];
        task.id = id;
        return task;
    }

    addTask(task) {
        task.id = Tasks.length;
        Tasks.push(task);
    }

    setTaskStatus(id, completed) {
        Tasks[id].completed = completed;
    }

    updateTask(id, task) {
        Tasks[id] = task;
    }

    deleteTask(id) {
        Tasks.splice(id, 1);
    }
}

module.exports = TaskService;