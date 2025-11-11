const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");

// Initialize Stats for user
router.post("/stats/init", statController.initializeStats);

// Get stats of a user
router.get("/stats/:userId", statController.getStats);

module.exports = router;
