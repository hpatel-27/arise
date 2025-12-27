const { achievement } = require("../db");

function userAchievementDTO(userAchievement) {
  return {
    id: userAchievement.id,
    achievementId: userAchievement.achievementId,
    dateUnlocked: userAchievement.dateUnlocked,
    status: userAchievement.status,
    progress: userAchievement.progress,
  };
}

module.exports = { userAchievementDTO };
