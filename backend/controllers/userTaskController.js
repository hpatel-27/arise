const userTaskService = require("../services/userTaskService");
const { userTaskDTO } = require("../dtos/userTask.dto");

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
    res.status(500).json({ error: error.message });
  }
}

async function completeTask(req, res) {
  try {
    const userId = req.user.userId;
    let { taskId } = req.params;
    taskId = parseInt(taskId, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid taskId" });
    }
    const completedTask = await userTaskService.completeTask(userId, taskId);
    res.json(userTaskDTO(completedTask));
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  assignTask,
  completeTask,
};
