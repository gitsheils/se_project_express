const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");

/*
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
*/
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
