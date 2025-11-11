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

module.exports = {
  initializeStats,
  getStats,
};
