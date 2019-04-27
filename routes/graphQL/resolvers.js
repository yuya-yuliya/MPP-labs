require("dotenv").config();
const UserService = require("../../services/user.service");
const TaskService = require("../../services/task.service");
const jwt = require("jsonwebtoken");
const { GraphQLDate } = require("graphql-iso-date");

const taskService = new TaskService();
const userService = new UserService();
const expires = 86400; // 24 houres

const userNotFoundErrorMessage = "404|Wrong login or/and password.";
const userExistsErrorMessage = "400|User with given login exists.";

const anautnErrorMessage = "401|Anauthorized.";
const taskNotFoundErrorMessage = "404|Task not found.";
const internalErrorMessage = "500|Error. Try again later.";

const resolvers = {
  Date: GraphQLDate,

  Query: {
    // Sign out
    signout: (_, args, { userId }) => {
      if (userId) {
        return true;
      } else {
        return false;
      }
    },

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
          throw new Error(taskNotFoundErrorMessage);
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
    // Sign in
    signin: async (_, { login, password }) => {
      try {
        let user = await userService.getUser(login, password);
        if (user) {
          let token = jwt.sign({ userId: user._id }, process.env.SECRET, {
            expiresIn: expires
          });
          return token;
        } else {
          throw {};
        }
      } catch {
        throw new Error(userNotFoundErrorMessage);
      }
    },

    // Sign up
    signup: async (_, { user }) => {
      user = await userService.addUser(user);
      if (user) {
        return { login: user.login };
      } else {
        throw new Error(userExistsErrorMessage);
      }
    },

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
          throw new Error(taskNotFoundErrorMessage);
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
          throw new Error(taskNotFoundErrorMessage);
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
