const request = require("supertest");

jest.mock("../../../db");
jest.mock("../../../config/passport", () => {
  const passport = require("passport");
  return passport;
});

const prisma = require("../../../db");
const { createApp } = require("../../helpers/app");
const { generateTestToken } = require("../../helpers/auth");
const { buildUser } = require("../../helpers/userFactory");

const app = createApp();

describe("Integration: User API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /v1/users (admin only)", () => {
    test("returns 401 when no token is provided", async () => {
      const res = await request(app).get("/v1/users");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });

    test("returns 403 when non-admin user requests", async () => {
      const token = generateTestToken(1);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        isAdmin: false,
      });

      const res = await request(app)
        .get("/v1/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Admin access required");
    });

    test("returns list of users for admin", async () => {
      const user1 = buildUser({ id: 2, email: "user1@example.com" });
      const user2 = buildUser({ id: 3, email: "user2@example.com" });

      const token = generateTestToken(1);

      // adminMiddleware lookup
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        isAdmin: true,
      });
      // service getAllUsers
      prisma.user.findMany.mockResolvedValue([user1, user2]);

      const res = await request(app)
        .get("/v1/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].email).toBe("user1@example.com");
      expect(res.body[1].email).toBe("user2@example.com");
      // should not expose password
      expect(res.body[0].password).toBeUndefined();
    });

    test("returns empty list when no users exist", async () => {
      const token = generateTestToken(1);

      prisma.user.findUnique.mockResolvedValue({ id: 1, isAdmin: true });
      prisma.user.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get("/v1/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("GET /v1/users/me", () => {
    test("returns 401 when no token is provided", async () => {
      const res = await request(app).get("/v1/users/me");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });

    test("returns 403 with an invalid token", async () => {
      const res = await request(app)
        .get("/v1/users/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Invalid token");
    });

    test("returns current user profile", async () => {
      const user = buildUser({ id: 1 });
      const token = generateTestToken(1);

      prisma.user.findUnique.mockResolvedValue(user);

      const res = await request(app)
        .get("/v1/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(user.email);
      expect(res.body.firstName).toBe(user.firstName);
      expect(res.body.lastName).toBe(user.lastName);
      expect(res.body.password).toBeUndefined();
      expect(res.body.id).toBeUndefined();
    });

    test("returns 404 when authenticated user no longer exists", async () => {
      const token = generateTestToken(999);
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/v1/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });

  describe("PATCH /v1/users/me", () => {
    test("returns 401 when no token is provided", async () => {
      const res = await request(app)
        .patch("/v1/users/me")
        .send({ firstName: "Test" });

      expect(res.status).toBe(401);
    });

    test("updates allowed user fields", async () => {
      const token = generateTestToken(1);
      const updatedUser = buildUser({
        id: 1,
        firstName: "Updated",
        lastName: "Name",
      });

      prisma.user.findUnique.mockResolvedValue(updatedUser);
      prisma.user.update.mockResolvedValue(updatedUser);

      const res = await request(app)
        .patch("/v1/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ firstName: "Updated", lastName: "Name" });

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe("Updated");
      expect(res.body.lastName).toBe("Name");
    });

    test("strips disallowed fields from request body", async () => {
      const token = generateTestToken(1);
      const user = buildUser({ id: 1 });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      const res = await request(app)
        .patch("/v1/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Safe",
          email: "hack@evil.com",
          isAdmin: true,
          password: "newpassword",
        });

      expect(res.status).toBe(200);
      // verify only allowed fields were passed to update
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { firstName: "Safe" },
        }),
      );
    });

    test("handles update with age and gender fields", async () => {
      const token = generateTestToken(1);
      const user = buildUser({ id: 1 });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      await request(app)
        .patch("/v1/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ firstName: "Test", age: 25, gender: "male" });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { firstName: "Test", age: 25, gender: "male" },
        }),
      );
    });
  });

  describe("DELETE /v1/users/me", () => {
    test("returns 401 when no token is provided", async () => {
      const res = await request(app).delete("/v1/users/me");

      expect(res.status).toBe(401);
    });

    test("deletes the authenticated user", async () => {
      const token = generateTestToken(1);
      const user = buildUser({ id: 1 });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.delete.mockResolvedValue(user);

      const res = await request(app)
        .delete("/v1/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(user.email);
      expect(prisma.user.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );
    });

    test("returns 404 when user does not exist", async () => {
      const token = generateTestToken(999);
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/v1/users/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
