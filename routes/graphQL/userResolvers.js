require("dotenv").config();
const UserService = require("../../services/user.service");
const jwt = require("jsonwebtoken");

const userService = new UserService();
const expires = 86400; // 24 houres

const notFoundErrorMessage = "404|Wrong login or/and password.";
const userExistsErrorMessage = "400|User with given login exists.";

const resolvers = {
  Query: {
    // Sign out
    signout: (_, args, { userId }) => {
      if (userId) {
        return true;
      } else {
        return false;
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
        throw new Error(notFoundErrorMessage);
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
    }
  }
};

module.exports = resolvers;
