const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");

// Initialize Stats for user
router.post("/stats/init", statController.initializeStats);

// Get stats of a user
router.get("/stats/:userId", statController.getStats);

// Get a stat for a user
router.get("/stats/:userId/:categoryId", statController.getStatByCategory);

// Update a stat using earned xp
router.patch("/stats/:userId", statController.updateStat);

module.exports = router;
