const ClothingItem = require("../models/clothingItem");
const {
  invalidInput,
  dataDoesNotExist,
  serverError,
} = require("../utils/errors");

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
  console.log(req.user._id);
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
/*
const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => {
      res.status(200).send(item);
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
*/
const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!(item.owner.toString() === req.user._id)) {
        return res.status(403).send("Item does not belong to user");
      }
      ClothingItem.findByIdAndDelete(req.params.itemId);
      return res.send(item);
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
