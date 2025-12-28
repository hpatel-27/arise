/**
 * API Integration Tests for User Routes
 * 
 * These tests make actual HTTP requests to test the full API stack:
 * Routes -> Middleware -> Controllers -> Services -> Database
 * 
 * Requirements:
 * - Test database must be available
 * - Server should not be running (or use a different port)
 * - Set TEST_DATABASE_URL in environment
 */

const request = require("supertest");
const express = require("express");
const cors = require("cors");
const { getTestPrisma, cleanupDatabase, disconnectDatabase } = require("../../helpers/database");
const jwtUtil = require("../../../utils/jwt");

// Import routes and middleware
const userRoutes = require("../../../routes/users");
const { authenticate } = require("../../../middleware/authMiddleware");

// Mock the db module to use test database
jest.mock("../../../db", () => {
  const { getTestPrisma } = require("../../helpers/database");
  return getTestPrisma();
});

describe("Users API - Integration Tests", () => {
  let app;
  let testPrisma;
  let authToken;
  let testUserId;

  beforeAll(async () => {
    testPrisma = getTestPrisma();
    await cleanupDatabase();

    // Create test app
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/api/users", userRoutes);

    // Create a test user and generate token
    const testUser = await testPrisma.user.create({
      data: {
        email: "apitest@example.com",
        password: "hashed-password",
        firstName: "API",
        lastName: "Test",
      },
    });
    testUserId = testUser.id;
    authToken = jwtUtil.generateToken(testUserId);
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    // Recreate test user
    const testUser = await testPrisma.user.create({
      data: {
        email: "apitest@example.com",
        password: "hashed-password",
        firstName: "API",
        lastName: "Test",
      },
    });
    testUserId = testUser.id;
    authToken = jwtUtil.generateToken(testUserId);
  });

  describe("GET /api/users/me", () => {
    it("should return current user with valid token", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email");
      expect(response.body.email).toBe("apitest@example.com");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .get("/api/users/me")
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toBe("No token provided");
        });
    });

    it("should return 403 with invalid token", async () => {
      await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(403)
        .expect((res) => {
          expect(res.body.error).toBe("Invalid token");
        });
    });
  });

  describe("PATCH /api/users/me", () => {
    it("should update user with valid data", async () => {
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
      };

      const response = await request(app)
        .patch("/api/users/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe("Updated");
      expect(response.body.lastName).toBe("Name");
    });

    it("should ignore unauthorized fields", async () => {
      const updateData = {
        firstName: "Test",
        email: "hacked@example.com", // Should be ignored
        isAdmin: true, // Should be ignored
      };

      const response = await request(app)
        .patch("/api/users/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe("Test");
      // Verify email wasn't changed (would need to check database)
      const user = await testPrisma.user.findUnique({ where: { id: testUserId } });
      expect(user.email).toBe("apitest@example.com");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .patch("/api/users/me")
        .send({ firstName: "Test" })
        .expect(401);
    });
  });

  describe("DELETE /api/users/me", () => {
    it("should delete current user", async () => {
      await request(app)
        .delete("/api/users/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verify user is deleted
      const user = await testPrisma.user.findUnique({ where: { id: testUserId } });
      expect(user).toBeNull();
    });

    it("should return 401 without token", async () => {
      await request(app)
        .delete("/api/users/me")
        .expect(401);
    });
  });

  describe("GET /api/users (Admin Only)", () => {
    it("should return 403 for non-admin users", async () => {
      await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });

    // Note: To test admin functionality, you'd need to create an admin user
    // and generate a token for that user
  });
});

