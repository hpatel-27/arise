import prisma from "../db";

async function getAllAchievements() {
  const achievements = await prisma.achievement.findMany({
    select: { id: true },
  });
  return achievements;
}

async function createAchievement(data) {
  const achievement = await prisma.achievement.create({ data });
  return achievement;
}

module.exports = { getAllAchievements, createAchievement };
