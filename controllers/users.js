const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  invalidInput,
  dataDoesNotExist,
  serverError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(serverError)
        .send({ message: "An error occured on the server." })
    );
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(invalidInput).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(dataDoesNotExist).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error occured on the server." });
    });
};
/*
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
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
*/
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "MongoServerError") {
        return res
          .status(invalidInput)
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
  console.log(req.headers);
  const { JWT_SECRET } = process.env;
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
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

module.exports = { getUsers, getUser, createUser, login, updateProfile };
