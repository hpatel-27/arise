// Global test setup
// This file runs before each test file

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-jwt";
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://test:test@localhost:5432/test_db";

// Increase timeout for integration tests
jest.setTimeout(10000);
