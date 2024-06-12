const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");

const { validateUserProfile } = require("../middleware/validation");
/*
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
*/
router.get("/me", getCurrentUser);
router.patch("/me", validateUserProfile, updateProfile);

module.exports = router;
