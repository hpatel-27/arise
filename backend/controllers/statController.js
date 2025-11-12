const statService = require("../services/statService");

async function initializeStats(req, res) {
  try {
    // User id should be passed through request, since this should happen at registration
    const userId = req.body.userId;
    const userStats = await statService.initializeStats(userId);
    res.status(201).json(userStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getStats(req, res) {
  try {
    const userId = req.user.userId;
    // Get the user's stats and return them
    const statInfo = await statService.getStats(userId);
    const userStats = {
      stats: statInfo,
    };

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getStatByCategory(req, res) {
  try {
    const userId = req.user.userId;

    let { categoryId } = req.params;
    categoryId = parseInt(categoryId, 10);

    const stat = await statService.getStatByCategory(userId, categoryId);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStat(req, res) {
  try {
    const userId = req.user.userId;

    const categoryId = req.body.categoryId;
    const xpEarned = req.body.xpEarned;

    const updatedStat = await statService.updateStats(
      userId,
      categoryId,
      xpEarned
    );
    res.status(204).json(updatedStat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  initializeStats,
  getStats,
  getStatByCategory,
  updateStat,
};
