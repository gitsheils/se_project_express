const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { dataDoesNotExist } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

const authorization = require("../middleware/auth");

/*
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res
    .status(dataDoesNotExist)
    .send({ message: "Requested resource not found" });
});
*/

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItemRouter);

router.use(authorization);
router.use("/users", userRouter);

router.use((req, res) => {
  res
    .status(dataDoesNotExist)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
