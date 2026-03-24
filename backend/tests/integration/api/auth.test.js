const request = require("supertest");
const bcrypt = require("bcrypt");

jest.mock("../../../db");
jest.mock("../../../config/passport", () => {
  const passport = require("passport");
  return passport;
});
jest.mock("../../../services/achievementService");
jest.mock("../../../services/statService");

const prisma = require("../../../db");
const achievementService = require("../../../services/achievementService");
const { createApp } = require("../../helpers/app");

const app = createApp();

describe("Integration: Auth API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /v1/auth/register", () => {
    test("returns 201 with userDTO on successful registration", async () => {
      const createdUser = {
        id: "user-1",
        email: "newuser@example.com",
        firstName: null,
        lastName: null,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
        lastLogin: null,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);

      const res = await request(app)
        .post("/v1/auth/register")
        .send({ email: "newuser@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe("newuser@example.com");
      expect(res.body.password).toBeUndefined();
      expect(res.body.id).toBeUndefined();
    });

    test("returns 409 when email is already in use", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "user-existing",
        email: "taken@example.com",
      });

      const res = await request(app)
        .post("/v1/auth/register")
        .send({ email: "taken@example.com", password: "password123" });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Email already in use");
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("POST /v1/auth/login", () => {
    test("returns 200 with token and unlockedAchievements on successful login", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 1,
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (streak resets)
      };

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      achievementService.updateStreakAchievements.mockResolvedValue([]);
      achievementService.updateAchievementsForAction.mockResolvedValue([]);

      const res = await request(app)
        .post("/v1/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.unlockedAchievements).toEqual([]);
    });

    test("returns 200 with unlocked achievements on login", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 6,
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      };

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      achievementService.updateStreakAchievements.mockResolvedValue([
        { id: "ach-1", name: "7-Day Streak" },
      ]);
      achievementService.updateAchievementsForAction.mockResolvedValue([]);

      const res = await request(app)
        .post("/v1/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.unlockedAchievements).toHaveLength(1);
      expect(res.body.unlockedAchievements[0].name).toBe("7-Day Streak");
    });

    test("returns 404 when email is not registered", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/v1/auth/login")
        .send({ email: "ghost@example.com", password: "password123" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        "This email is not registered. Please sign up."
      );
    });

    test("returns 400 when password is incorrect", async () => {
      const hashedPassword = await bcrypt.hash("correctpassword", 10);
      const user = {
        id: "user-1",
        email: "test@example.com",
        password: hashedPassword,
        loginStreak: 1,
        lastLogin: null,
      };

      prisma.user.findUnique.mockResolvedValue(user);

      const res = await request(app)
        .post("/v1/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid password. Please try again.");
    });
  });
});
