const { buildUser } = require("../../helpers/userFactory");

// mock dependencies before importing the controller
jest.mock("../../../services/authService");
jest.mock("../../../services/statService");

const authService = require("../../../services/authService");
const statService = require("../../../services/statService");
const authController = require("../../../controllers/authController");

function mockReqRes(overrides = {}) {
  const req = {
    body: {},
    ...overrides,
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn(),
  };

  return { req, res };
}

describe("Unit Testing AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("returns 201 with userDTO on successful registration", async () => {
      const fakeUser = buildUser({ id: "user-1", lastLogin: null });
      authService.register.mockResolvedValue(fakeUser);
      statService.initializeStats.mockResolvedValue(undefined);

      const { req, res } = mockReqRes({
        body: { email: fakeUser.email, password: "password123" },
      });
      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(
        fakeUser.email,
        "password123"
      );
      expect(statService.initializeStats).toHaveBeenCalledWith(fakeUser.id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        email: fakeUser.email,
        firstName: fakeUser.firstName,
        lastName: fakeUser.lastName,
        createdAt: fakeUser.createdAt,
        updatedAt: fakeUser.updatedAt,
        lastLogin: fakeUser.lastLogin,
      });
    });

    test("returns 409 when email is already in use", async () => {
      authService.register.mockRejectedValue(new Error("Email already in use"));

      const { req, res } = mockReqRes({
        body: { email: "taken@example.com", password: "password123" },
      });
      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already in use" });
    });

    test("returns 400 for other registration errors", async () => {
      authService.register.mockRejectedValue(new Error("Invalid email format"));

      const { req, res } = mockReqRes({
        body: { email: "bad-email", password: "password123" },
      });
      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid email format" });
    });

    test("does not initialize stats when registration fails", async () => {
      authService.register.mockRejectedValue(new Error("Email already in use"));

      const { req, res } = mockReqRes({
        body: { email: "taken@example.com", password: "password123" },
      });
      await authController.register(req, res);

      expect(statService.initializeStats).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    test("returns token and unlockedAchievements on successful login", async () => {
      const fakeToken = "fake-jwt-token";
      const fakeAchievements = [{ id: "ach-1", name: "First Login" }];
      authService.login.mockResolvedValue({
        token: fakeToken,
        unlockedAchievements: fakeAchievements,
      });

      const { req, res } = mockReqRes({
        body: { email: "test@example.com", password: "password123" },
      });
      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(res.json).toHaveBeenCalledWith({
        token: fakeToken,
        unlockedAchievements: fakeAchievements,
      });
    });

    test("returns empty unlockedAchievements when none are unlocked", async () => {
      authService.login.mockResolvedValue({
        token: "fake-jwt-token",
        unlockedAchievements: [],
      });

      const { req, res } = mockReqRes({
        body: { email: "test@example.com", password: "password123" },
      });
      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: "fake-jwt-token",
        unlockedAchievements: [],
      });
    });

    test("returns 404 when email is not registered", async () => {
      authService.login.mockRejectedValue(
        new Error("This email is not registered. Please sign up.")
      );

      const { req, res } = mockReqRes({
        body: { email: "unknown@example.com", password: "password123" },
      });
      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "This email is not registered. Please sign up.",
      });
    });

    test("returns 400 when password is invalid", async () => {
      authService.login.mockRejectedValue(
        new Error("Invalid password. Please try again.")
      );

      const { req, res } = mockReqRes({
        body: { email: "test@example.com", password: "wrongpassword" },
      });
      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid password. Please try again.",
      });
    });

    test("returns 500 for unexpected errors", async () => {
      authService.login.mockRejectedValue(new Error("Database connection lost"));

      const { req, res } = mockReqRes({
        body: { email: "test@example.com", password: "password123" },
      });
      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database connection lost",
      });
    });
  });

  describe("googleCallback", () => {
    test("redirects with token from req.user", async () => {
      const { req, res } = mockReqRes({
        user: { token: "google-jwt-token" },
      });
      await authController.googleCallback(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/auth/callback?token=google-jwt-token"
      );
    });
  });
});
