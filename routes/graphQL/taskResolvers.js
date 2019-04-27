const { GraphQLDate } = require("graphql-iso-date");
const TaskService = require("../../services/task.service");

const taskService = new TaskService();

const anautnErrorMessage = "401|Anauthorized.";
const notFoundErrorMessage = "404|Task not found.";
const internalErrorMessage = "500|Error. Try again later.";

const resolvers = {
  Date: GraphQLDate,

  Query: {
    // Get all tasks
    tasks: async (_, args, { userId }) => {
      if (userId) {
        let tasks = await taskService.getTasks(userId);
        return tasks;
      } else {
        throw new Error(anautnErrorMessage);
      }
    },

    // Get task by id
    taskById: async (_, { id }, { userId }) => {
      if (userId) {
        let task = await taskService.getTask(id, userId);
        if (task) {
          return task;
        } else {
          throw new Error(notFoundErrorMessage);
        }
      } else {
        throw new Error(anautnErrorMessage);
      }
    },

    // Download attached file
    downloadFile: (_, { fileName }, { userId }) => {
      return true;
    }
  },

  Mutation: {
    // Create new task
    createTask: async (_, { task }, { userId }) => {
      if (userId) {
        task.user = userId;
        task = await taskService.addTask(data.task);
        if (task) {
          return task;
        } else {
          throw new Error(internalErrorMessage);
        }
      } else {
        throw new Error(anautnErrorMessage);
      }
    },

    // Update task
    updateTask: async (_, { task }, { userId }) => {
      if (userId) {
        let oldTask = await taskService.getTask(task.id, userId);
        if (oldTask) {
          task.user = userId;
          task = await taskService.updateTask(task);
          return task;
        } else {
          throw new Error(notFoundErrorMessage);
        }
      } else {
        throw new Error(anautnErrorMessage);
      }
    },

    // Delete task
    deleteTask: async (_, { id }, { userId }) => {
      if (userId) {
        try {
          await taskService.deleteTask(id, userId);
          return true;
        } catch {
          throw new Error(notFoundErrorMessage);
        }
      } else {
        throw new Error(anautnErrorMessage);
      }
    },

    // Set task completion status
    setTaskStatus: async (_, { id, completed }, { userId }) => {
      if (userId) {
        await taskService.setTaskStatus(id, completed, userId);
        return true;
      } else {
        throw new Error(anautnErrorMessage);
      }
    },

    // Delete attached to task file
    deleteAttachedFile: async (_, { id }, { userId }) => {
      if (userId) {
        await taskService.deleteFile(id, userId);
        return true;
      } else {
        throw new Error(anautnErrorMessage);
      }
    }
  }
};

module.exports = resolvers;
