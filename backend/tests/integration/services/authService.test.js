jest.mock("../../../db");
jest.mock("../../../services/achievementService");
jest.mock("../../../utils/jwt", () => ({
  generateToken: jest.fn().mockReturnValue("test-jwt-token"),
}));

const prisma = require("../../../db");
const bcrypt = require("bcrypt");
const achievementService = require("../../../services/achievementService");
const authService = require("../../../services/authService");
const userService = require("../../../services/userService");
const { buildUser } = require("../../helpers/userFactory");

describe("Integration: Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    achievementService.updateStreakAchievements.mockResolvedValue([]);
    achievementService.updateAchievementsForAction.mockResolvedValue([]);
  });

  describe("register then login flow", () => {
    test("a registered user can log in with correct credentials", async () => {
      const email = "newuser@example.com";
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = {
        id: "user-1",
        email,
        password: hashedPassword,
        loginStreak: 0,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // register: no existing user, then create
      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValue(createdUser);

      const registered = await authService.register(email, password);
      expect(registered.email).toBe(email);

      // login: find user, update streak
      prisma.user.findUnique.mockResolvedValueOnce(createdUser);
      prisma.user.update.mockResolvedValue(createdUser);

      const { token, unlockedAchievements } = await authService.login(email, password);
      expect(token).toBeDefined();
      expect(unlockedAchievements).toEqual([]);
    });

    test("registering with a duplicate email throws and prevents create", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "user-existing",
        email: "existing@example.com",
      });

      await expect(
        authService.register("existing@example.com", "password123")
      ).rejects.toThrow("Email already in use");

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("register then retrieve user flow", () => {
    test("a registered user can be retrieved by id", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const createdUser = {
        id: "user-1",
        email: "new@example.com",
        password: hashedPassword,
        firstName: null,
        lastName: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // register
      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValue(createdUser);

      const registered = await authService.register("new@example.com", "password123");
      expect(registered.email).toBe("new@example.com");

      // retrieve by id
      const retrieveUser = buildUser({ id: "user-1", email: "new@example.com" });
      prisma.user.findUnique.mockResolvedValueOnce(retrieveUser);

      const found = await userService.getUserById("user-1");
      expect(found.email).toBe("new@example.com");
    });
  });

  describe("login error cases", () => {
    test("login with unregistered email throws", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login("nobody@example.com", "password123")
      ).rejects.toThrow("This email is not registered. Please sign up.");

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    test("login with wrong password throws", async () => {
      const hashedPassword = await bcrypt.hash("correctpassword", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 1,
        lastLogin: null,
      };

      prisma.user.findUnique.mockResolvedValue(user);

      await expect(
        authService.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid password. Please try again.");

      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("login streak update flow", () => {
    test("streak increments when logging in on consecutive days", async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 4,
        lastLogin: yesterday,
      };

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, loginStreak: 5 });

      await authService.login("test@example.com", "password123");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({ loginStreak: 5 }),
      });
    });

    test("streak resets to 1 after more than one day of inactivity", async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 10,
        lastLogin: threeDaysAgo,
      };

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, loginStreak: 1 });

      await authService.login("test@example.com", "password123");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({ loginStreak: 1 }),
      });
    });

    test("streak achievements are not updated on same-day login", async () => {
      const today = new Date();

      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 3,
        lastLogin: today,
      };

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      await authService.login("test@example.com", "password123");

      expect(achievementService.updateStreakAchievements).not.toHaveBeenCalled();
      expect(achievementService.updateAchievementsForAction).toHaveBeenCalledWith(
        user.id,
        "login"
      );
    });
  });
});
