const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// Get all users (for testing purposes)
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);

module.exports = router;
