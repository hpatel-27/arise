/**
 * Unit Tests for AuthMiddleware
 * 
 * These tests verify authentication middleware logic.
 */

const { authenticate } = require("../../../middleware/authMiddleware");
const jwtUtil = require("../../../utils/jwt");
const { createMockRequest, createMockResponse, createMockNext } = require("../../helpers/testHelpers");

jest.mock("../../../utils/jwt");

describe("AuthMiddleware - Unit Tests", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should call next() when valid token is provided", () => {
      const decodedToken = { userId: 1 };
      mockReq.headers.authorization = "Bearer valid-token";

      jwtUtil.verifyToken.mockReturnValue(decodedToken);

      authenticate(mockReq, mockRes, mockNext);

      expect(jwtUtil.verifyToken).toHaveBeenCalledWith("valid-token");
      expect(mockReq.user).toEqual(decodedToken);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should return 401 when no authorization header is provided", () => {
      mockReq.headers.authorization = undefined;

      authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "No token provided",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header is empty", () => {
      mockReq.headers.authorization = "";

      authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "No token provided",
      });
    });

    it("should return 403 when token is invalid", () => {
      mockReq.headers.authorization = "Bearer invalid-token";

      jwtUtil.verifyToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid token",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should extract token correctly from Bearer format", () => {
      const decodedToken = { userId: 1 };
      mockReq.headers.authorization = "Bearer my-secret-token";

      jwtUtil.verifyToken.mockReturnValue(decodedToken);

      authenticate(mockReq, mockRes, mockNext);

      expect(jwtUtil.verifyToken).toHaveBeenCalledWith("my-secret-token");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle malformed authorization header", () => {
      mockReq.headers.authorization = "NotBearer token";

      jwtUtil.verifyToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

