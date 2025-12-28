/**
 * Unit Tests for UserController
 * 
 * These tests mock the service layer to test controller logic in isolation.
 * Tests HTTP request/response handling, error handling, and status codes.
 */

const userController = require("../../../controllers/userController");
const userService = require("../../../services/userService");
const { createMockRequest, createMockResponse } = require("../../helpers/testHelpers");
const { userDTO } = require("../../../dtos/user.dto");

// Mock the service layer
jest.mock("../../../services/userService");
jest.mock("../../../dtos/user.dto", () => ({
  userDTO: jest.fn((user) => ({ ...user, transformed: true })),
}));

describe("UserController - Unit Tests", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users with 200 status", async () => {
      const mockUsers = [
        { id: 1, email: "user1@example.com" },
        { id: 2, email: "user2@example.com" },
      ];

      userService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockReq, mockRes);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        mockUsers.map((user) => ({ ...user, transformed: true }))
      );
      expect(mockRes.status).not.toHaveBeenCalled(); // Default 200
    });

    it("should handle service errors with 500 status", async () => {
      const error = new Error("Database connection failed");
      userService.getAllUsers.mockRejectedValue(error);

      await userController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Database connection failed",
      });
    });
  });

  describe("getUserById", () => {
    it("should return current user with 200 status", async () => {
      const mockUser = { id: 1, email: "test@example.com" };
      mockReq.user = { userId: 1 };
      userService.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(mockReq, mockRes);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        ...mockUser,
        transformed: true,
      });
    });

    it("should return 404 when user not found", async () => {
      mockReq.user = { userId: 999 };
      userService.getUserById.mockRejectedValue(new Error("User not found"));

      await userController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("should return 500 for other errors", async () => {
      mockReq.user = { userId: 1 };
      userService.getUserById.mockRejectedValue(
        new Error("Internal server error")
      );

      await userController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateUser", () => {
    it("should update and return user with 200 status", async () => {
      const updateData = { firstName: "Updated", lastName: "Name" };
      const updatedUser = { id: 1, email: "test@example.com", ...updateData };

      mockReq.user = { userId: 1 };
      mockReq.body = updateData;
      userService.updateUser.mockResolvedValue(updatedUser);

      await userController.updateUser(mockReq, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(1, updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        ...updatedUser,
        transformed: true,
      });
    });

    it("should return 500 on service error", async () => {
      mockReq.user = { userId: 1 };
      mockReq.body = { firstName: "Test" };
      userService.updateUser.mockRejectedValue(new Error("Update failed"));

      await userController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Update failed",
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete and return user with 200 status", async () => {
      const deletedUser = { id: 1, email: "test@example.com" };
      mockReq.user = { userId: 1 };
      userService.deleteUser.mockResolvedValue(deletedUser);

      await userController.deleteUser(mockReq, mockRes);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        ...deletedUser,
        transformed: true,
      });
    });

    it("should return 404 when user not found", async () => {
      mockReq.user = { userId: 999 };
      userService.deleteUser.mockRejectedValue(new Error("User not found"));

      await userController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("should return 500 for other errors", async () => {
      mockReq.user = { userId: 1 };
      userService.deleteUser.mockRejectedValue(new Error("Delete failed"));

      await userController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Delete failed",
      });
    });
  });
});

