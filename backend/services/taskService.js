const prisma = require("../db");

async function getAllTasks() {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  return tasks;
}

async function getTaskById(id) {
  const task = await prisma.task.findUnique({
    where: { id: parseInt(id, 10) },
  });
  if (!task) throw new Error(`Task with id "${id}" not found.`);

  return task;
}

async function createTask(data) {
  const existingTask = await prisma.task.findUnique({
    where: { name: data.name },
  });
  if (existingTask)
    throw new Error(`Task with name "${data.name}" already exists.`);

  const task = await prisma.task.create({ data });
  return task;
}

async function updateTask(id, data) {
  let parsedId = parseInt(id, 10);
  const existingTask = await prisma.task.findUnique({
    where: { id: parsedId },
  });
  if (!existingTask) throw new Error(`Task with id "${id}" not found.`);

  const task = await prisma.task.update({
    where: { id: parsedId },
    data,
  });
  return task;
}

async function deleteTask(taskId) {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!existingTask) throw new Error(`Task with id "${taskId}" not found.`);

  const task = await prisma.task.delete({ where: { id: taskId } });
  return task;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
