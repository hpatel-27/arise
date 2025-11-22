const prisma = require("../db");
const logService = require("./logService");
const statService = require("./statService");

async function assignTask(userId, taskId) {}

async function completeTask(userId, taskId) {
  const updatedTask = await prisma.userTask.update({
    where: { userId_taskId: { userId, taskId } },
    data: { isComplete: true, completedAt: new Date() },
  });

  // log task completion, the updated task as metadata
  await logService.recordUserAction(userId, "task_completed", updatedTask);

  // Grab the categoryId and the xp from the task
  const taskData = await prisma.task.findUnique({
    where: { id: taskId },
  });

  // update the user's stats based on the task they completed
  const updatedStats = await statService.updateStats(
    userId,
    taskData.categoryId,
    taskData.xpValue
  );

  // log that that the stats have changed
  await logService.recordUserAction(userId, "stat_update", updatedStats);
}

module.exports = {
  assignTask,
  completeTask,
};
