const userTaskService = require("../services/userTaskService");
const { userTaskDTO } = require("../dtos/userTask.dto");
const { userTaskCompletionDTO } = require("../dtos/userTaskCompleted.dto");

async function getAllActiveTasksForUser(req, res) {
  try {
    const userId = req.user.userId;
    const tasks = await userTaskService.getAllActiveTasksForUser(userId);
    res.json(tasks.map(userTaskDTO));
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
}

async function getTaskForUser(req, res) {
  try {
    const userId = req.user.userId;
    let { taskId } = req.params;
    taskId = parseInt(taskId, 10);
    if (isNaN(taskId)) {
      throw new Error("Invalid taskId");
    }
    if (taskId <= 0) {
      throw new Error("TaskId must be greater than 0");
    }
    const task = await userTaskService.getTaskForUser(userId, taskId);
    res.json(userTaskDTO(task));
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
}

async function assignTask(req, res) {
  try {
    const userId = req.user.userId;
    let { taskId } = req.params;
    taskId = parseInt(taskId, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid taskId" });
    }

    const assignedTask = await userTaskService.assignTask(userId, taskId);
    res.json(userTaskDTO(assignedTask));
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
}

async function completeTask(req, res) {
  try {
    const userId = req.user.userId;
    let { taskId } = req.params;
    taskId = parseInt(taskId, 10);
    if (isNaN(taskId)) {
      throw new Error("Invalid taskId");
    }
    if (taskId <= 0) {
      throw new Error("TaskId must be greater than 0");
    }
    const completedTask = await userTaskService.completeTask(userId, taskId);
    res.json(userTaskCompletionDTO(completedTask));
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
}

module.exports = {
  getAllActiveTasksForUser,
  getTaskForUser,
  assignTask,
  completeTask,
};
