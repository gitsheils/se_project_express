const router = require("express").Router();
const { updateProfile } = require("../controllers/users");

/*
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
*/
router.patch("/me", updateProfile);

module.exports = router;
