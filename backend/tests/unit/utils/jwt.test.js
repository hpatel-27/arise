/**
 * Unit Tests for JWT Utility
 * 
 * Tests JWT token generation and verification.
 */

const jwtUtil = require("../../../utils/jwt");
const jwt = require("jsonwebtoken");

// Mock jsonwebtoken
jest.mock("jsonwebtoken");

describe("JWT Utility - Unit Tests", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-key";
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  describe("generateToken", () => {
    it("should generate a token with correct payload", () => {
      const userId = 1;
      const mockToken = "mock-jwt-token";

      jwt.sign.mockReturnValue(mockToken);

      const result = jwtUtil.generateToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        "test-secret-key",
        { expiresIn: "1h" }
      );
      expect(result).toBe(mockToken);
    });

    it("should generate different tokens for different users", () => {
      jwt.sign
        .mockReturnValueOnce("token-1")
        .mockReturnValueOnce("token-2");

      const token1 = jwtUtil.generateToken(1);
      const token2 = jwtUtil.generateToken(2);

      expect(token1).toBe("token-1");
      expect(token2).toBe("token-2");
      expect(jwt.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe("verifyToken", () => {
    it("should verify and return decoded token", () => {
      const token = "valid-token";
      const decoded = { userId: 1 };

      jwt.verify.mockReturnValue(decoded);

      const result = jwtUtil.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, "test-secret-key");
      expect(result).toEqual(decoded);
    });

    it("should throw error for invalid token", () => {
      const token = "invalid-token";
      const error = new Error("Invalid token");

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => jwtUtil.verifyToken(token)).toThrow("Invalid token");
      expect(jwt.verify).toHaveBeenCalledWith(token, "test-secret-key");
    });

    it("should throw error for expired token", () => {
      const token = "expired-token";
      const error = new Error("Token expired");

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => jwtUtil.verifyToken(token)).toThrow("Token expired");
    });
  });
});

