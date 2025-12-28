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
      prisma.user.findUnique.mockResolvedValue(null);

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
});
