require("dotenv").config();
const UserService = require("../../services/user.service");
const TaskService = require("../../services/task.service");
const jwt = require("jsonwebtoken");
const { GraphQLDateTime } = require("graphql-iso-date");

const path = require("path");
const fs = require("fs");

const uploadsDirectory = path.join(
  path.dirname(require.main.filename),
  "public",
  "uploads"
);

const taskService = new TaskService();
const userService = new UserService();
const expires = 86400; // 24 houres

const userNotFoundErrorMessage = "404|Wrong login or/and password.";
const userExistsErrorMessage = "400|User with given login exists.";

const anautnErrorMessage = "401|Anauthorized.";
const taskNotFoundErrorMessage = "404|Task not found.";
const internalErrorMessage = "500|Error. Try again later.";

const resolvers = {
  DateTime: GraphQLDateTime,

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
    createTask: async (_, { task, file }, { userId }) => {
      if (userId) {
        task.fileName = undefined;
        task.realFileName = undefined;
        if (file) {
          const { createReadStream, filename } = await file;
          let stream = createReadStream();
          let newFileName = await saveFile(filename, stream);
          if (newFileName) {
            task.fileName = filename;
            task.realFileName = newFileName;
          }
        }

        task.user = userId;
        task = await taskService.addTask(task);
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
    updateTask: async (_, { task, file }, { userId }) => {
      if (userId) {
        let oldTask = await taskService.getTask(task._id, userId);
        if (oldTask) {
          task.fileName = undefined;
          task.realFileName = undefined;
          if (file) {
            if (oldTask.fileName) {
              await taskService.deleteFile(task._id, userId);
            }

            const { createReadStream, filename } = await file;
            let stream = createReadStream();
            let newFileName = await saveFile(filename, stream);
            if (newFileName) {
              task.fileName = filename;
              task.realFileName = newFileName;
            }
          }

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

function saveFile(fileName, stream) {
  let newName = `${Date.now()}.${fileName}`;
  let filePath = path.join(uploadsDirectory, newName);

  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated) {
          fs.unlinkSync(filePath);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(filePath))
      .on("error", error => reject(error))
      .on("finish", () => resolve(newName))
  );
}

module.exports = resolvers;
