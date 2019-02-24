const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  fileName: {
    type: String
  },
  realFileName: {
    type: String
  }
});

module.exports = mongoose.model("Task", taskSchema);