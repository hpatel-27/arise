const {
  mockUserExists,
  mockUserNotFound,
} = require("../../helpers/mockUserPrisma");

// mock real prisma client before importing it
jest.mock("../../../db");

// This imports the mocked prisma client, by automatically identifying the __mocks__ directory
// at the same place as the db.js file
const prisma = require("../../../db");
const userService = require("../../../services/userService");

describe("Unit Testing UserService", () => {
  // reset prisma mock state before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("returns the list of users when they exist", async () => {
      // setup fake data
      const userId1 = "user-1";
      const fakeUser1 = {
        id: userId1,
        email: "test1@example.com",
        firstName: "Test1",
        lastName: "User1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userId2 = "user-2";
      const fakeUser2 = {
        id: userId2,
        email: "test2@example.com",
        firstName: "Test2",
        lastName: "User2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Expect a list of two users
      prisma.user.findMany.mockResolvedValue([fakeUser1, fakeUser2]);
      const result = await userService.getAllUsers();

      expect(result).toEqual([fakeUser1, fakeUser2]);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    test("returns an empty list when there are no users", async () => {
      // fake data of no users
      prisma.user.findMany.mockResolvedValue([]);
      const result = await userService.getAllUsers();

      // Expect empty list
      expect(result).toEqual([]);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe("getUserById", () => {
    test("returns a user when the user exists", async () => {
      // setup fake data
      const userId = "user-123";

      const fakeUser = {
        id: userId,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(fakeUser);

      // make the actual request to the service
      const result = await userService.getUserById(userId);

      // assert - returned value
      expect(result).toEqual(fakeUser);

      // assert - prisma query contract
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    test("throw error when user not found", async () => {
      // setup missing user
      const userId = "missing-id";
      mockUserNotFound();

      // make the actual request to the service
      await expect(userService.getUserById(userId)).rejects.toThrow(
        "User not found"
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe("deleteUser", () => {
    test("delete an user that exists", async () => {
      const user = mockUserExists();

      const result = await userService.deleteUser(user.id);
      expect(result).toEqual(user);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    test("attempt delete on user that does not exist", async () => {
      const userId = "missing-id";
      mockUserNotFound();

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        `User with id "missing-id" not found.`
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe("updateUser", () => {});
});
