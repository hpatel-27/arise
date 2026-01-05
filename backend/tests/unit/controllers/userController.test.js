const {
  mockUserExists,
  mockUserNotFound,
} = require("../../helpers/mockUserPrisma");
const { buildUser } = require("../../helpers/userFactory");

// mock real prisma client before importing it
jest.mock("../../../db");

// This imports the mocked prisma client, by automatically identifying the __mocks__ directory
// at the same place as the db.js file
const prisma = require("../../../db");
const userController = require("../../../controllers/userController");

describe("Unit Testing UserController", () => {
  // reset mock state after every test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("returns the list of users when they exist", async () => {
      const result = await userController.getAllUsers();
    });

    test("returns an empty list when there are no users", async () => {
      const result = await userController.getAllUsers();
    });
  });

  describe("getUserById");
  describe("deleteUser");
  describe("updateUser");
});
