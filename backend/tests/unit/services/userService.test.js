/**
 * Unit Tests for UserService
 * 
 * These tests mock Prisma to test service logic in isolation.
 * No database connection is required.
 */

const userService = require("../../../services/userService");
const { createPrismaMock } = require("../../helpers/prismaMock");
const { createMockUser } = require("../../helpers/testHelpers");

// Mock the db module
jest.mock("../../../db", () => createPrismaMock());

describe("UserService - Unit Tests", () => {
  let mockPrisma;

  beforeEach(() => {
    // Get a fresh mock instance for each test
    mockPrisma = require("../../../db");
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        createMockUser({ id: 1, email: "user1@example.com" }),
        createMockUser({ id: 2, email: "user2@example.com" }),
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no users exist", async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      const mockUser = createMockUser({ id: 1 });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow("User not found");
    });
  });

  describe("updateUser", () => {
    it("should update and return user", async () => {
      const updateData = { firstName: "Updated", lastName: "Name" };
      const updatedUser = createMockUser({ id: 1, ...updateData });

      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, updateData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(updatedUser);
      expect(result.firstName).toBe("Updated");
    });

    it("should throw error when user not found", async () => {
      mockPrisma.user.update.mockRejectedValue(
        new Error("Record to update does not exist")
      );

      await expect(
        userService.updateUser(999, { firstName: "Test" })
      ).rejects.toThrow();
    });
  });

  describe("deleteUser", () => {
    it("should delete and return user", async () => {
      const mockUser = createMockUser({ id: 1 });
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const result = await userService.deleteUser(1);

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user not found", async () => {
      mockPrisma.user.delete.mockRejectedValue(
        new Error("Record to delete does not exist")
      );

      await expect(userService.deleteUser(999)).rejects.toThrow();
    });
  });
});

