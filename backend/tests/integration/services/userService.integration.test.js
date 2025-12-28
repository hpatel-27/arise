/**
 * Integration Tests for UserService
 * 
 * These tests use a real test database to verify service behavior
 * with actual database operations.
 * 
 * Requirements:
 * - A test database must be available
 * - Set TEST_DATABASE_URL in your environment or .env file
 * - Run migrations on the test database before running these tests
 */

const userService = require("../../../services/userService");
const { getTestPrisma, cleanupDatabase, disconnectDatabase } = require("../../helpers/database");

// Use test database instead of mocked Prisma
jest.mock("../../../db", () => {
  const { getTestPrisma } = require("../../helpers/database");
  return getTestPrisma();
});

describe("UserService - Integration Tests", () => {
  let testPrisma;
  let createdUserId;

  beforeAll(async () => {
    testPrisma = getTestPrisma();
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
  });

  beforeEach(async () => {
    // Clean up before each test
    await cleanupDatabase();
  });

  describe("User CRUD Operations", () => {
    it("should create, read, update, and delete a user", async () => {
      // Create a user directly in the database (since we don't have a create method in service)
      const createdUser = await testPrisma.user.create({
        data: {
          email: "integration-test@example.com",
          password: "hashed-password",
          firstName: "Integration",
          lastName: "Test",
        },
      });
      createdUserId = createdUser.id;

      // Test: Get user by ID
      const retrievedUser = await userService.getUserById(createdUserId);
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser.email).toBe("integration-test@example.com");
      expect(retrievedUser.firstName).toBe("Integration");

      // Test: Update user
      const updateData = { firstName: "Updated", lastName: "Name" };
      const updatedUser = await userService.updateUser(createdUserId, updateData);
      expect(updatedUser.firstName).toBe("Updated");
      expect(updatedUser.lastName).toBe("Name");

      // Test: Get all users
      const allUsers = await userService.getAllUsers();
      expect(allUsers.length).toBeGreaterThan(0);
      expect(allUsers.some((u) => u.id === createdUserId)).toBe(true);

      // Test: Delete user
      const deletedUser = await userService.deleteUser(createdUserId);
      expect(deletedUser.id).toBe(createdUserId);

      // Verify deletion
      await expect(userService.getUserById(createdUserId)).rejects.toThrow(
        "User not found"
      );
    });

    it("should handle multiple users", async () => {
      // Create multiple users
      const user1 = await testPrisma.user.create({
        data: {
          email: "user1@test.com",
          password: "pass1",
          firstName: "User",
          lastName: "One",
        },
      });

      const user2 = await testPrisma.user.create({
        data: {
          email: "user2@test.com",
          password: "pass2",
          firstName: "User",
          lastName: "Two",
        },
      });

      const allUsers = await userService.getAllUsers();
      expect(allUsers.length).toBeGreaterThanOrEqual(2);

      // Clean up
      await userService.deleteUser(user1.id);
      await userService.deleteUser(user2.id);
    });

    it("should throw error when updating non-existent user", async () => {
      await expect(
        userService.updateUser(99999, { firstName: "Test" })
      ).rejects.toThrow();
    });

    it("should throw error when deleting non-existent user", async () => {
      await expect(userService.deleteUser(99999)).rejects.toThrow();
    });
  });

  describe("User Query Operations", () => {
    it("should return users with correct field selection", async () => {
      const createdUser = await testPrisma.user.create({
        data: {
          email: "query-test@example.com",
          password: "password",
          firstName: "Query",
          lastName: "Test",
        },
      });

      const retrievedUser = await userService.getUserById(createdUser.id);

      // Verify only selected fields are returned
      expect(retrievedUser).toHaveProperty("id");
      expect(retrievedUser).toHaveProperty("email");
      expect(retrievedUser).toHaveProperty("firstName");
      expect(retrievedUser).toHaveProperty("lastName");
      expect(retrievedUser).toHaveProperty("createdAt");
      expect(retrievedUser).toHaveProperty("updatedAt");
      expect(retrievedUser).not.toHaveProperty("password");
      expect(retrievedUser).not.toHaveProperty("googleId");

      await userService.deleteUser(createdUser.id);
    });
  });
});

