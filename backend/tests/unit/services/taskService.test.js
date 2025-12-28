/**
 * Unit Tests for TaskService
 * 
 * These tests mock Prisma to test service logic in isolation.
 */

const taskService = require("../../../services/taskService");
const { createPrismaMock } = require("../../helpers/prismaMock");
const { createMockTask } = require("../../helpers/testHelpers");

jest.mock("../../../db", () => createPrismaMock());

describe("TaskService - Unit Tests", () => {
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = require("../../../db");
    jest.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("should return all tasks ordered by id", async () => {
      const mockTasks = [
        createMockTask({ id: 1, name: "Task 1" }),
        createMockTask({ id: 2, name: "Task 2" }),
      ];

      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks();

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        orderBy: { id: "asc" },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe("getTaskById", () => {
    it("should return task when found", async () => {
      const mockTask = createMockTask({ id: 1 });
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockTask);
    });

    it("should throw error when task not found", async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(taskService.getTaskById(999)).rejects.toThrow(
        'Task with id "999" not found.'
      );
    });
  });

  describe("createTask", () => {
    it("should create and return new task", async () => {
      const taskData = {
        categoryId: 1,
        name: "New Task",
        requirement: "Complete new task",
        xpValue: 100,
      };
      const createdTask = createMockTask({ id: 1, ...taskData });

      mockPrisma.task.findUnique.mockResolvedValue(null); // No existing task
      mockPrisma.task.create.mockResolvedValue(createdTask);

      const result = await taskService.createTask(taskData);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { name: taskData.name },
      });
      expect(mockPrisma.task.create).toHaveBeenCalledWith({ data: taskData });
      expect(result).toEqual(createdTask);
    });

    it("should throw error when task name already exists", async () => {
      const taskData = { name: "Existing Task", categoryId: 1 };
      const existingTask = createMockTask({ name: "Existing Task" });

      mockPrisma.task.findUnique.mockResolvedValue(existingTask);

      await expect(taskService.createTask(taskData)).rejects.toThrow(
        'Task with name "Existing Task" already exists.'
      );
      expect(mockPrisma.task.create).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    it("should update and return task", async () => {
      const existingTask = createMockTask({ id: 1 });
      const updateData = { xpValue: 200 };
      const updatedTask = { ...existingTask, ...updateData };

      mockPrisma.task.findUnique.mockResolvedValue(existingTask);
      mockPrisma.task.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, updateData);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(updatedTask);
    });

    it("should throw error when task not found", async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(
        taskService.updateTask(999, { xpValue: 200 })
      ).rejects.toThrow('Task with id "999" not found.');
      expect(mockPrisma.task.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should delete and return task", async () => {
      const mockTask = createMockTask({ id: 1 });
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.delete.mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(1);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTask);
    });

    it("should throw error when task not found", async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(taskService.deleteTask(999)).rejects.toThrow(
        'Task with id "999" not found.'
      );
      expect(mockPrisma.task.delete).not.toHaveBeenCalled();
    });
  });
});

