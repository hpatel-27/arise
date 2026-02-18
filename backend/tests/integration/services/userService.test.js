jest.mock("../../../db");

const prisma = require("../../../db");
const userService = require("../../../services/userService");
const authService = require("../../../services/authService");
const bcrypt = require("bcrypt");
const { buildUser } = require("../../helpers/userFactory");

describe("Integration: User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register then retrieve user flow", () => {
    test("a registered user can be retrieved by id", async () => {
      const createdUser = {
        id: 1,
        email: "new@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: null,
        lastName: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // register creates the user
      prisma.user.findUnique.mockResolvedValueOnce(null); // no existing user
      prisma.user.create.mockResolvedValue(createdUser);

      const registered = await authService.register(
        "new@example.com",
        "password123",
      );
      expect(registered.email).toBe("new@example.com");

      // now retrieve that user
      const retrieveUser = buildUser({
        id: 1,
        email: "new@example.com",
      });
      prisma.user.findUnique.mockResolvedValueOnce(retrieveUser);

      const found = await userService.getUserById(1);
      expect(found.email).toBe("new@example.com");
    });

    test("registering a duplicate email throws error", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: "existing@example.com",
      });

      await expect(
        authService.register("existing@example.com", "password123"),
      ).rejects.toThrow("Email already in use");

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("update then retrieve user flow", () => {
    test("updated fields are reflected when user is retrieved", async () => {
      const originalUser = buildUser({ id: 1 });
      const updatedUser = buildUser({
        id: 1,
        firstName: "Updated",
        lastName: "Name",
      });

      // existence check for update
      prisma.user.findUnique.mockResolvedValueOnce(originalUser);
      // update returns updated user
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, {
        firstName: "Updated",
        lastName: "Name",
      });

      expect(result.firstName).toBe("Updated");
      expect(result.lastName).toBe("Name");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { firstName: "Updated", lastName: "Name" },
        select: expect.objectContaining({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        }),
      });
    });
  });

  describe("delete user flow", () => {
    test("deleting a user prevents further retrieval", async () => {
      const user = buildUser({ id: 1 });

      // existence check for delete
      prisma.user.findUnique.mockResolvedValueOnce(user);
      // delete returns deleted user
      prisma.user.delete.mockResolvedValue(user);

      const deleted = await userService.deleteUser(1);
      expect(deleted.email).toBe(user.email);

      // attempting to retrieve after delete should fail
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(userService.getUserById(1)).rejects.toThrow(
        "User not found",
      );
    });

    test("cannot delete the same user twice", async () => {
      const user = buildUser({ id: 1 });

      // first delete succeeds
      prisma.user.findUnique.mockResolvedValueOnce(user);
      prisma.user.delete.mockResolvedValue(user);
      await userService.deleteUser(1);

      // second delete fails - user no longer exists
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(userService.deleteUser(1)).rejects.toThrow(
        'User with id "1" not found.',
      );
    });
  });

  describe("update non-existent user", () => {
    test("cannot update a user that does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.updateUser(999, { firstName: "Ghost" }),
      ).rejects.toThrow('User with id "999" not found.');

      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("getAllUsers returns consistent data", () => {
    test("returns all users with selected fields only", async () => {
      const users = [
        buildUser({ id: 1, email: "a@example.com" }),
        buildUser({ id: 2, email: "b@example.com" }),
        buildUser({ id: 3, email: "c@example.com" }),
      ];

      prisma.user.findMany.mockResolvedValue(users);

      const result = await userService.getAllUsers();
      expect(result).toHaveLength(3);

      // verify the select clause was used (no password field)
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: expect.not.objectContaining({ password: true }),
      });
    });
  });
});
