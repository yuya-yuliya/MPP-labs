const express = require("express");
const router = express.Router();
const UserService = require("../services/user.service");
const jwt = require("jsonwebtoken");

const userService = new UserService();
const expires = 86400; // 24 houres

/*router.get("/seed", async (req, res) => {
    const TaskService = require("../services/task.service");
    const taskService = new TaskService();

    let user1 = {
        login: "admin",
        password: "admin"
    };

    let user2 = {
        login: "user",
        password: "123456"
    };

    user1 = await userService.addUser(user1);
    user2 = await userService.addUser(user2);

    let taskU1 = {
        title: "User 1 task",
        dueDate: Date.now(),
        completed: false,
        user: user1._id
    };
    let taskU2 = {
        title: "User 2 task",
        dueDate: Date.now(),
        completed: false,
        user: user2._id
    };

    taskU1 = await taskService.addTask(taskU1);
    taskU2 = await taskService.addTask(taskU2);

    res.status(200).send({});
});*/

// Sign in
router.post("/signin", async (request, response) => {
  try {
    let user = await userService.getUser(request.body.login, request.body.password);
    if (user) {
      let token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: expires
      });
      response.status(200).send({ auth: true, token: token });
    } else {
      response.status(404).send("No user found.");
    }
  } catch {
    return response.status(401).send({ auth: false, token: null });
  }
});

// Sign up
router.post("/signup", async (request, response) => {
  let user = {
    login: request.body.login,
    password: request.body.password
  };

  user = await userService.addUser(user);
  if (user) {
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: expires
    });
    response.status(200).send({ auth: true, token: token });
  } else {
    response.status(500).send({});
  }
});

// Sign out
router.get("/signout", (request, response) => {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
