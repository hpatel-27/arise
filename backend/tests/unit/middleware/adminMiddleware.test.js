/**
 * Unit Tests for AdminMiddleware
 * 
 * These tests verify admin authorization middleware logic.
 */

const { requireAdmin } = require("../../../middleware/adminMiddleware");
const jwtUtil = require("../../../utils/jwt");
const prisma = require("../../../db");
const { createMockRequest, createMockResponse, createMockNext } = require("../../helpers/testHelpers");

jest.mock("../../../utils/jwt");
jest.mock("../../../db", () => {
  const { createPrismaMock } = require("../../helpers/prismaMock");
  return createPrismaMock();
});

describe("AdminMiddleware - Unit Tests", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe("requireAdmin", () => {
    it("should call next() when user is admin", async () => {
      const decodedToken = { userId: 1 };
      const adminUser = { id: 1, isAdmin: true };

      mockReq.headers.authorization = "Bearer valid-token";
      jwtUtil.verifyToken.mockReturnValue(decodedToken);
      prisma.user.findUnique.mockResolvedValue(adminUser);

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(jwtUtil.verifyToken).toHaveBeenCalledWith("valid-token");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, isAdmin: true },
      });
      expect(mockReq.user).toEqual({ userId: 1, isAdmin: true });
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should return 403 when user is not admin", async () => {
      const decodedToken = { userId: 1 };
      const regularUser = { id: 1, isAdmin: false };

      mockReq.headers.authorization = "Bearer valid-token";
      jwtUtil.verifyToken.mockReturnValue(decodedToken);
      prisma.user.findUnique.mockResolvedValue(regularUser);

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Admin access required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when no authorization header is provided", async () => {
      mockReq.headers.authorization = undefined;

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "No token provided",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when token is missing from Bearer format", async () => {
      mockReq.headers.authorization = "Bearer";

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "No token provided",
      });
    });

    it("should return 404 when user not found", async () => {
      const decodedToken = { userId: 999 };

      mockReq.headers.authorization = "Bearer valid-token";
      jwtUtil.verifyToken.mockReturnValue(decodedToken);
      prisma.user.findUnique.mockResolvedValue(null);

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User not found",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 when token is invalid", async () => {
      mockReq.headers.authorization = "Bearer invalid-token";

      jwtUtil.verifyToken.mockImplementation(() => {
        const error = new Error("Invalid token");
        error.name = "JsonWebTokenError";
        throw error;
      });

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid or expired token",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 when token is expired", async () => {
      mockReq.headers.authorization = "Bearer expired-token";

      jwtUtil.verifyToken.mockImplementation(() => {
        const error = new Error("Token expired");
        error.name = "TokenExpiredError";
        throw error;
      });

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid or expired token",
      });
    });

    it("should return 500 for unexpected errors", async () => {
      mockReq.headers.authorization = "Bearer valid-token";

      jwtUtil.verifyToken.mockReturnValue({ userId: 1 });
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      await requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});

