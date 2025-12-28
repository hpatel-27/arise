/**
 * Integration Tests for TaskService
 * 
 * These tests use a real test database to verify task service behavior.
 */

const taskService = require("../../../services/taskService");
const { getTestPrisma, cleanupDatabase, disconnectDatabase } = require("../../helpers/database");

jest.mock("../../../db", () => {
  const { getTestPrisma } = require("../../helpers/database");
  return getTestPrisma();
});

describe("TaskService - Integration Tests", () => {
  let testPrisma;
  let testCategory;

  beforeAll(async () => {
    testPrisma = getTestPrisma();
    await cleanupDatabase();

    // Create a test category
    testCategory = await testPrisma.category.create({
      data: {
        name: "Integration Test Category",
        description: "Category for integration tests",
      },
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    // Recreate category after cleanup
    testCategory = await testPrisma.category.upsert({
      where: { name: "Integration Test Category" },
      update: {},
      create: {
        name: "Integration Test Category",
        description: "Category for integration tests",
      },
    });
  });

  describe("Task CRUD Operations", () => {
    it("should create, read, update, and delete a task", async () => {
      // Create
      const taskData = {
        categoryId: testCategory.id,
        name: "Integration Test Task",
        requirement: "Complete integration test",
        xpValue: 100,
        targetValue: 1,
      };

      const createdTask = await taskService.createTask(taskData);
      expect(createdTask).toBeDefined();
      expect(createdTask.name).toBe(taskData.name);
      expect(createdTask.xpValue).toBe(100);

      // Read
      const retrievedTask = await taskService.getTaskById(createdTask.id);
      expect(retrievedTask.id).toBe(createdTask.id);
      expect(retrievedTask.name).toBe(taskData.name);

      // Update
      const updateData = { xpValue: 200 };
      const updatedTask = await taskService.updateTask(createdTask.id, updateData);
      expect(updatedTask.xpValue).toBe(200);

      // Delete
      const deletedTask = await taskService.deleteTask(createdTask.id);
      expect(deletedTask.id).toBe(createdTask.id);

      // Verify deletion
      await expect(taskService.getTaskById(createdTask.id)).rejects.toThrow();
    });

    it("should prevent duplicate task names", async () => {
      const taskData = {
        categoryId: testCategory.id,
        name: "Unique Task Name",
        requirement: "Test uniqueness",
        xpValue: 50,
      };

      await taskService.createTask(taskData);

      // Try to create duplicate
      await expect(taskService.createTask(taskData)).rejects.toThrow(
        'Task with name "Unique Task Name" already exists.'
      );

      // Clean up
      const task = await testPrisma.task.findUnique({
        where: { name: "Unique Task Name" },
      });
      if (task) {
        await taskService.deleteTask(task.id);
      }
    });

    it("should return all tasks ordered by id", async () => {
      const task1 = await taskService.createTask({
        categoryId: testCategory.id,
        name: "Task 1",
        requirement: "First task",
        xpValue: 50,
      });

      const task2 = await taskService.createTask({
        categoryId: testCategory.id,
        name: "Task 2",
        requirement: "Second task",
        xpValue: 75,
      });

      const allTasks = await taskService.getAllTasks();
      expect(allTasks.length).toBeGreaterThanOrEqual(2);

      // Verify ordering
      const task1Index = allTasks.findIndex((t) => t.id === task1.id);
      const task2Index = allTasks.findIndex((t) => t.id === task2.id);
      expect(task1Index).toBeLessThan(task2Index);

      // Clean up
      await taskService.deleteTask(task1.id);
      await taskService.deleteTask(task2.id);
    });
  });
});

