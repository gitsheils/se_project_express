const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  invalidInput,
  dataDoesNotExist,
  serverError,
  conflict,
  unauthorized,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res
        .status(201)
        .send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
    })
    .catch((err) => {
      if (err.name === "MongoServerError") {
        return res
          .status(conflict)
          .send({ message: "This email is already taken" });
      }
      if (err.name === "ValidationError") {
        return res.status(invalidInput).send({ message: "Invalid data" });
      }
      return res
        .status(serverError)
        .send({ message: "An error occured on the server." });
    });
};

const login = (req, res) => {
  const { JWT_SECRET = "dev-key" } = process.env;
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(unauthorized).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error occured on the server." });
    });
};
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidInput).send({ message: "Invalid data" });
      }
      return res
        .status(serverError)
        .send({ message: "An error occured on the server." });
    });
};
const getCurrentUser = (req, res) => {
  User.findById(req.user._id).then((user) => res.send(user));
};

module.exports = {
  createUser,
  login,
  updateProfile,
  getCurrentUser,
};
