const prisma = require("../db");

// Returns all achievements merged with the given user's progress.
// userId is optional — omitting it returns raw achievements (admin use).
async function getAllAchievements(userId) {
  const achievements = await prisma.achievement.findMany({
    orderBy: { id: "asc" },
  });

  if (!userId) return achievements;

  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
  });

  const progressMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

  return achievements.map((achievement) => {
    const record = progressMap.get(achievement.id);
    return {
      ...achievement,
      progress: record?.progress ?? 0,
      unlocked: record?.status ?? false,
      dateUnlocked: record?.dateUnlocked ?? null,
    };
  });
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

// Returns an array of Achievement objects that were unlocked by this action.
async function updateAchievementsForAction(userId, actionType) {
  // 1. Fetch all achievements tied to this metric
  const relatedAchievements = await prisma.achievement.findMany({
    where: { metric: actionType },
  });

  if (relatedAchievements.length === 0) return [];

  const achievementIds = relatedAchievements.map((a) => a.id);

  // 2. Batch-fetch existing progress records for this user in one query
  const existingRecords = await prisma.userAchievement.findMany({
    where: { userId, achievementId: { in: achievementIds } },
  });

  const existingMap = new Map(existingRecords.map((r) => [r.achievementId, r]));

  const unlockedAchievements = [];

  for (const achievement of relatedAchievements) {
    const existing = existingMap.get(achievement.id);

    // Skip already-unlocked achievements
    if (existing?.status) continue;

    const currentProgress = existing?.progress ?? 0;
    const newProgress = currentProgress + 1;
    const shouldUnlock =
      achievement.targetValue != null && newProgress >= achievement.targetValue;

    const updateData = {
      progress: shouldUnlock ? achievement.targetValue : newProgress,
      ...(shouldUnlock ? { status: true, dateUnlocked: new Date() } : {}),
    };

    // Single upsert per achievement (create or update in one round-trip)
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
      update: updateData,
      create: { userId, achievementId: achievement.id, ...updateData },
    });

    if (shouldUnlock) {
      unlockedAchievements.push(achievement);
    }
  }

  return unlockedAchievements;
}

// Sets achievement progress to streakLength (rather than incrementing).
// Used for login streak achievements where progress = current streak count.
// Returns an array of Achievement objects that were newly unlocked.
async function updateStreakAchievements(userId, streakLength) {
  const streakAchievements = await prisma.achievement.findMany({
    where: { metric: "login_streak" },
  });

  if (streakAchievements.length === 0) return [];

  const achievementIds = streakAchievements.map((a) => a.id);

  const existingRecords = await prisma.userAchievement.findMany({
    where: { userId, achievementId: { in: achievementIds } },
  });

  const existingMap = new Map(existingRecords.map((r) => [r.achievementId, r]));

  const unlockedAchievements = [];

  for (const achievement of streakAchievements) {
    const existing = existingMap.get(achievement.id);
    if (existing?.status) continue;

    const shouldUnlock =
      achievement.targetValue != null && streakLength >= achievement.targetValue;
    const newProgress = shouldUnlock ? achievement.targetValue : streakLength;

    const updateData = {
      progress: newProgress,
      ...(shouldUnlock ? { status: true, dateUnlocked: new Date() } : {}),
    };

    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
      update: updateData,
      create: { userId, achievementId: achievement.id, ...updateData },
    });

    if (shouldUnlock) unlockedAchievements.push(achievement);
  }

  return unlockedAchievements;
}

module.exports = {
  getAllAchievements,
  createAchievement,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
  updateAchievementsForAction,
  updateStreakAchievements,
};
