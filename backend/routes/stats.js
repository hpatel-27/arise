const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");
const { authenticate } = require("../middleware/authMiddleware");

// Initialize Stats for user
router.post("/stats/init", statController.initializeStats);

// Get stats of a user
router.get("/stats/me", authenticate, statController.getStats);

// Get a stat for a user
router.get(
  "/stats/me/:categoryId",
  authenticate,
  statController.getStatByCategory
);

// Update a stat using earned xp
router.patch("/stats/me", authenticate, statController.updateStat);

module.exports = router;
