const prisma = require("../db");
const logService = require("./logService");
const statService = require("./statService");

// Get all tasks for a user
async function getAllActiveTasksForUser(userId) {
  const tasks = await prisma.userTask.findMany({
    where: { userId, isActive: true },
  });
  // If the tasks are not found, throw an error
  if (!tasks) {
    throw new Error("No active tasks found for user.");
  }

  // If the tasks are found, get the task data
  const tasksWithData = await Promise.all(
    tasks.map(async (task) => {
      const taskData = await prisma.task.findUnique({
        where: { id: task.taskId },
      });
      return { ...task, taskData };
    })
  );

  return tasksWithData;
}

// Get a task for a user
async function getTaskForUser(userId, taskId) {
  const task = await prisma.userTask.findFirst({
    where: { userId, taskId, isActive: true },
  });
  // If the task is not found, throw an error
  if (!task) {
    throw new Error("Task is not available for user.");
  }
  // If the task is found, get the task data
  const taskData = await prisma.task.findUnique({
    where: { id: task.taskId },
  });
  return { ...task, taskData };
}

async function assignTask(userId, taskId) {
  // On create entry for user and task link, it is active and has 0 progress by default
  // If the task is being updated, that means the task was inactive and completed previously
  const assignedTask = await prisma.userTask.upsert({
    where: { userId_taskId: { userId, taskId } },
    update: { isActive: true },
    create: { userId: userId, taskId: taskId },
  });

  return assignedTask;
}

async function completeTask(userId, taskId) {
  // Check that the userTask exists and isActive
  const userTask = await prisma.userTask.findFirst({
    where: { userId, taskId, isActive: true },
  });

  if (!userTask) {
    throw new Error("Task sent for completion is not available.");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Make task data available for access later
    const taskData = await tx.task.findUnique({
      where: { id: taskId },
    });

    if (!taskData) {
      throw new Error("Task does not exist.");
    }

    // 1. Reset progress
    const updatedTask = await tx.userTask.update({
      where: { userId_taskId: { userId, taskId } },
      data: { progress: 0, isActive: false },
    });

    // 2. Complete task
    const completedTask = await tx.userTaskCompletion.create({
      data: {
        userTaskId: updatedTask.id,
        completedAt: new Date(),
        xpEarned: taskData.xpValue,
      },
    });

    return { updatedTask, completedTask, taskData };
  });

  // log the task update that reset it
  await logService.recordUserAction(userId, "task_updated", result.updatedTask);

  // log task completion
  await logService.recordUserAction(
    userId,
    "task_completed",
    result.completedTask
  );

  // update the user's stats based on the task they completed
  const updatedStats = await statService.updateStats(
    userId,
    result.taskData.categoryId,
    result.taskData.xpValue
  );

  // log that that the stats have changed
  await logService.recordUserAction(userId, "stat_update", updatedStats);

  return result.completedTask;
}

module.exports = {
  getAllActiveTasksForUser,
  getTaskForUser,
  assignTask,
  completeTask,
};
