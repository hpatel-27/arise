const taskService = require("../services/taskService");
const pickFields = require("../utils/pickFields");
const { taskDTO } = require("../dtos/task.dto");

async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks.map(taskDTO));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getTaskById(req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id, 10);
    const task = await taskService.getTaskById(id);
    res.json(taskDTO(task));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function createTask(req, res) {
  try {
    const data = {
      categoryId: req.body.categoryId,
      name: req.body.name,
      requirement: req.body.requirement,
      xpValue: req.body?.xpValue,
    };

    const task = await taskService.createTask(data);
    res.status(201).json(taskDTO(task));
  } catch (error) {
    if (error.message.includes("already exists")) {
      res.status(409).json({ error: `Task "${data.name}" already exists.` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function updateTask(req, res) {
  try {
    const data = pickFields(req.body, [
      "categoryId",
      "name",
      "requirement",
      "xpValue",
    ]);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    let { id } = req.params;
    id = parseInt(id, 10);

    const task = await taskService.updateTask(id, data);
    res.json(taskDTO(task));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function deleteTask(req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id, 10);

    const task = await taskService.deleteTask(id);
    res.json(taskDTO(task));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
