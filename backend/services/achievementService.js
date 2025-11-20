const prisma = require("../db");

async function getAllAchievements() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { id: "asc" },
  });
  return achievements;
}

async function createAchievement(data) {
  const achievement = await prisma.achievement.create({ data });
  return achievement;
}

async function getAchievementById(id) {
  const achievement = await prisma.achievement.findUnique({
    where: { id: parseInt(id, 10) },
  });
  return achievement;
}

async function updateAchievement(id, data) {
  const achievement = await prisma.achievement.update({
    where: { id: parseInt(id, 10) },
    data,
  });
  return achievement;
}

async function deleteAchievement(id) {
  // may throw error if achievement with given id does not exist
  const achievement = await prisma.achievement.delete({
    where: { id: parseInt(id, 10) },
  });
  // return the deleted achievement
  return achievement;
}

// internal function for updating user progress, typically on logging a significant action
async function updateAchievementsForAction(userId, actionType) {
  // Get all achievements tied to this type
  const relatedAchievements = await prisma.achievement.findMany({
    where: { metric: actionType },
  });

  for (const achievement of relatedAchievements) {
    const userAchievement = await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: { userId, achievementId: achievement.id },
      },
      update: {},
      create: { userId, achievementId: achievement.id },
    });

    if (!userAchievement.status) {
      const newProgress = userAchievement.progress + 1;

      if (achievement.targetValue && newProgress >= achievement.targetValue) {
        await prisma.userAchievement.update({
          where: { id: userAchievement.id },
          data: {
            progress: achievement.targetValue,
            status: true,
            dateUnlocked: new Date(),
          },
        });
      } else {
        await prisma.userAchievement.update({
          where: { id: userAchievement.id },
          data: { progress: newProgress },
        });
      }
    }
  }
}

module.exports = {
  getAllAchievements,
  createAchievement,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
  updateAchievementsForAction,
};
