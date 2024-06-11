const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const authorization = require("../middleware/auth");

const { validateItem, validateId } = require("../middleware/validation");

router.get("/", getItems);

router.use(authorization);
router.post("/", validateItem, createItem);
router.delete("/:itemId", validateId, deleteItem);

router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
