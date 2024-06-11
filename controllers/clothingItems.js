const ClothingItem = require("../models/clothingItem");
const {
  invalidInput,
  dataDoesNotExist,
  serverError,
  forbidden,
} = require("../utils/errors");

const ErrorBadRequest = require("../utils/ErrorBadRequest");
const ErrorUnauthorized = require("../utils/ErrorUnauthorized");
const ErrorForbidden = require("../utils/ErrorForbidden");
const ErrorNotFound = require("../utils/ErrorNotFound");
const ErrorConflict = require("../utils/ErrorConflict");
const ErrorServer = require("../utils/ErrorServer");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => next(new ErrorServer("An error occured on the server.")));
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ErrorBadRequest("Invalid data"));
      }
      return next(new ErrorServer("An error occured on the server."));
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!(item.owner.toString() === req.user._id)) {
        return res
          .status(forbidden)
          .send({ message: "Item does not belong to user" });
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId).then(() =>
        res.send(item)
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ErrorBadRequest("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new ErrorNotFound(err.message));
      }
      return next(new ErrorServer("An error occured on the server."));
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ErrorBadRequest("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new ErrorNotFound(err.message));
      }
      return next(new ErrorServer("An error occured on the server."));
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ErrorBadRequest("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new ErrorNotFound(err.message));
      }
      return next(new ErrorServer("An error occured on the server."));
    });
};

/*
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res
        .status(serverError)
        .send({ message: "An error occured on the server." })
    );
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidInput).send({ message: "Invalid data" });
      }
      return res
        .status(serverError)
        .send({ message: "An error occured on the server." });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!(item.owner.toString() === req.user._id)) {
        return res
          .status(forbidden)
          .send({ message: "Item does not belong to user" });
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId).then(() =>
        res.send(item)
      );
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

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
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

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
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
*/
module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
