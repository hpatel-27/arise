const prisma = require("../db");
const achievementService = require("../services/achievementService");

// internal function for logging a significant action
async function recordUserAction(userId, actionType, metadata = {}) {
  await prisma.userLog.create({
    data: { userId, type: actionType, metadata },
  });

  await achievementService.updateAchievementsForAction(userId, actionType);
}

async function getAllLogs() {
  const logs = await prisma.userLog.findMany({
    orderBy: { timestamp: "desc" },
  });
  return logs;
}

async function getLogById(logId) {
  const log = await prisma.userLog.findUnique({ where: { id: logId } });
  if (!log) throw new Error("Log not found");
  return log;
}

async function getUserLogs(userId) {
  const logs = await prisma.userLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });
  return logs;
}

async function getUserLog(userId, logId) {
  const log = await prisma.userLog.findFirst({
    where: { id: logId, userId },
  });
  if (!log) throw new Error("Log not found");
  return log;
}

module.exports = {
  recordUserAction,
  getAllLogs,
  getLogById,
  getUserLogs,
  getUserLog,
};
