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
    let { userId } = req.params;
    userId = parseInt(userId, 10);

    // Get the user's stats and return them
    const statInfo = await statService.getStats(userId);
    const userStats = {
      userId: userId,
      stats: statInfo,
    };

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getStatByCategory(req, res) {
  try {
    let { userId, categoryId } = req.params;
    const stat = await statService.getStatByCategory(userId, categoryId);
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStat(req, res) {
  try {
    let { userId } = req.params;
    userId = parseInt(userId, 10);

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
