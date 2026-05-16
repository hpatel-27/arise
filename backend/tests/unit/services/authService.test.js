jest.mock("../../../db");
jest.mock("bcrypt");
jest.mock("../../../utils/jwt");
jest.mock("../../../services/achievementService");

const prisma = require("../../../db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../../utils/jwt");
const achievementService = require("../../../services/achievementService");
const { register, login, computeStreak } = require("../../../services/authService");

describe("Unit Testing AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("creates and returns a new user with a hashed password", async () => {
      const email = "new@example.com";
      const password = "password123";
      const hashedPassword = "hashed-password";
      const createdUser = {
        id: "user-1",
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue(createdUser);

      const result = await register(email, password);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email, password: hashedPassword },
      });
      expect(result).toEqual(createdUser);
    });

    test("throws 'Email already in use' when email is taken", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "user-existing", email: "taken@example.com" });

      await expect(register("taken@example.com", "password123")).rejects.toThrow(
        "Email already in use"
      );

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    function buildLoginUser(overrides = {}) {
      return {
        id: "user-1",
        email: "test@example.com",
        password: "hashed-password",
        loginStreak: 3,
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        ...overrides,
      };
    }

    test("returns token and unlockedAchievements on successful login", async () => {
      const user = buildLoginUser();
      const fakeToken = "jwt-token-abc";
      const streakUnlocks = [{ id: "ach-streak" }];
      const loginUnlocks = [{ id: "ach-login" }];

      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(user);
      achievementService.updateStreakAchievements.mockResolvedValue(streakUnlocks);
      achievementService.updateAchievementsForAction.mockResolvedValue(loginUnlocks);
      generateToken.mockReturnValue(fakeToken);

      const result = await login(user.email, "password123");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", user.password);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { lastLogin: expect.any(Date), loginStreak: expect.any(Number) },
      });
      expect(result.token).toBe(fakeToken);
      expect(result.unlockedAchievements).toEqual([...streakUnlocks, ...loginUnlocks]);
    });

    test("skips streak achievements when logging in on the same day", async () => {
      const user = buildLoginUser({ lastLogin: new Date() }); // today

      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(user);
      achievementService.updateAchievementsForAction.mockResolvedValue([]);
      generateToken.mockReturnValue("jwt-token");

      await login(user.email, "password123");

      expect(achievementService.updateStreakAchievements).not.toHaveBeenCalled();
    });

    test("throws when email is not registered", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(login("ghost@example.com", "password123")).rejects.toThrow(
        "This email is not registered. Please sign up."
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test("throws when password does not match", async () => {
      const user = buildLoginUser();

      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(login(user.email, "wrongpassword")).rejects.toThrow(
        "Invalid password. Please try again."
      );

      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("computeStreak", () => {
    const TODAY = new Date("2025-06-15T12:00:00Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(TODAY);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("returns streak of 1 and isSameDay false when no lastLogin", () => {
      const result = computeStreak(null, 0);

      expect(result).toEqual({ newStreak: 1, isSameDay: false });
    });

    test("returns same streak and isSameDay true when logging in on the same day", () => {
      const lastLogin = new Date("2025-06-15T08:00:00Z"); // same day, earlier

      const result = computeStreak(lastLogin, 5);

      expect(result).toEqual({ newStreak: 5, isSameDay: true });
    });

    test("increments streak by 1 when logging in on consecutive days", () => {
      const lastLogin = new Date("2025-06-14T20:00:00Z"); // yesterday

      const result = computeStreak(lastLogin, 4);

      expect(result).toEqual({ newStreak: 5, isSameDay: false });
    });

    test("resets streak to 1 when more than one day has passed", () => {
      const lastLogin = new Date("2025-06-12T10:00:00Z"); // 3 days ago

      const result = computeStreak(lastLogin, 7);

      expect(result).toEqual({ newStreak: 1, isSameDay: false });
    });
  });
});
