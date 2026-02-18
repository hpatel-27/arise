const { buildUser } = require("../../helpers/userFactory");

// mock userService before importing the controller
jest.mock("../../../services/userService");

const userService = require("../../../services/userService");
const userController = require("../../../controllers/userController");

// helper to build mock req/res
function mockReqRes(overrides = {}) {
  const req = {
    user: { userId: "user-123" },
    body: {},
    ...overrides,
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  return { req, res };
}

describe("Unit Testing UserController", () => {
  // reset mock state after every test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("returns the list of users when they exist", async () => {
      // setup fake data
      const fakeUser1 = buildUser({ id: "user-1", email: "test1@example.com" });
      const fakeUser2 = buildUser({ id: "user-2", email: "test2@example.com" });

      userService.getAllUsers.mockResolvedValue([fakeUser1, fakeUser2]);

      const { req, res } = mockReqRes();
      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith([
        {
          email: fakeUser1.email,
          firstName: fakeUser1.firstName,
          lastName: fakeUser1.lastName,
          createdAt: fakeUser1.createdAt,
          updatedAt: fakeUser1.updatedAt,
          lastLogin: fakeUser1.lastLogin,
        },
        {
          email: fakeUser2.email,
          firstName: fakeUser2.firstName,
          lastName: fakeUser2.lastName,
          createdAt: fakeUser2.createdAt,
          updatedAt: fakeUser2.updatedAt,
          lastLogin: fakeUser2.lastLogin,
        },
      ]);
    });

    test("returns an empty list when there are no users", async () => {
      userService.getAllUsers.mockResolvedValue([]);

      const { req, res } = mockReqRes();
      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    test("returns 500 when service throws an error", async () => {
      userService.getAllUsers.mockRejectedValue(new Error("Database error"));

      const { req, res } = mockReqRes();
      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getUserById", () => {
    test("returns a user when the user exists", async () => {
      const fakeUser = buildUser();
      userService.getUserById.mockResolvedValue(fakeUser);

      const { req, res } = mockReqRes();
      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith("user-123");
      expect(res.json).toHaveBeenCalledWith({
        email: fakeUser.email,
        firstName: fakeUser.firstName,
        lastName: fakeUser.lastName,
        createdAt: fakeUser.createdAt,
        updatedAt: fakeUser.updatedAt,
        lastLogin: fakeUser.lastLogin,
      });
    });

    test("returns 404 when user not found", async () => {
      userService.getUserById.mockRejectedValue(new Error("User not found"));

      const { req, res } = mockReqRes();
      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    test("returns 500 when service throws an unexpected error", async () => {
      userService.getUserById.mockRejectedValue(new Error("Database error"));

      const { req, res } = mockReqRes();
      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("deleteUser", () => {
    test("deletes a user that exists", async () => {
      const fakeUser = buildUser();
      userService.deleteUser.mockResolvedValue(fakeUser);

      const { req, res } = mockReqRes();
      await userController.deleteUser(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith("user-123");
      expect(res.json).toHaveBeenCalledWith({
        email: fakeUser.email,
        firstName: fakeUser.firstName,
        lastName: fakeUser.lastName,
        createdAt: fakeUser.createdAt,
        updatedAt: fakeUser.updatedAt,
        lastLogin: fakeUser.lastLogin,
      });
    });

    test("returns 404 when deleting a user that does not exist", async () => {
      userService.deleteUser.mockRejectedValue(new Error("User not found"));

      const { req, res } = mockReqRes();
      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("returns 500 when service throws an unexpected error", async () => {
      userService.deleteUser.mockRejectedValue(new Error("Database error"));

      const { req, res } = mockReqRes();
      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateUser", () => {
    test("updates a user that exists", async () => {
      const fakeUser = buildUser({ email: "updated@email.com" });
      userService.updateUser.mockResolvedValue(fakeUser);

      const { req, res } = mockReqRes({
        body: { firstName: "Updated", lastName: "Name" },
      });
      await userController.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith("user-123", {
        firstName: "Updated",
        lastName: "Name",
      });
      expect(res.json).toHaveBeenCalledWith({
        email: fakeUser.email,
        firstName: fakeUser.firstName,
        lastName: fakeUser.lastName,
        createdAt: fakeUser.createdAt,
        updatedAt: fakeUser.updatedAt,
        lastLogin: fakeUser.lastLogin,
      });
    });

    test("only picks allowed fields from request body", async () => {
      const fakeUser = buildUser();
      userService.updateUser.mockResolvedValue(fakeUser);

      const { req, res } = mockReqRes({
        body: { firstName: "Updated", email: "hack@evil.com", role: "admin" },
      });
      await userController.updateUser(req, res);

      // email and role should be stripped out by pickFields
      expect(userService.updateUser).toHaveBeenCalledWith("user-123", {
        firstName: "Updated",
      });
    });

    test("returns 500 when service throws an error", async () => {
      userService.updateUser.mockRejectedValue(new Error("Database error"));

      const { req, res } = mockReqRes({ body: { firstName: "Test" } });
      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
