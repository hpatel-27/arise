const prisma = require("../db");
const achievementService = require("../services/achievementService");

// internal function for logging a significant action
async function recordUserAction(userId, actionType, metadata = {}) {
  await prisma.userLog.create({
    data: { userId, type: actionType, metadata },
  });

  await achievementService.updateAchievementsForAction(userId, actionType);
}

module.exports = { recordUserAction };
