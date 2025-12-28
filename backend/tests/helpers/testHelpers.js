/**
 * Test Helpers
 * 
 * Common utilities for testing
 */

/**
 * Creates a mock Express request object
 */
function createMockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides,
  };
}

/**
 * Creates a mock Express response object
 */
function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Creates a mock Express next function
 */
function createMockNext() {
  return jest.fn();
}

/**
 * Creates a mock user object
 */
function createMockUser(overrides = {}) {
  return {
    id: 1,
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Creates a mock task object
 */
function createMockTask(overrides = {}) {
  return {
    id: 1,
    categoryId: 1,
    name: "Test Task",
    requirement: "Complete test task",
    xpValue: 50,
    targetValue: 1,
    ...overrides,
  };
}

/**
 * Waits for a specified amount of time (useful for async testing)
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockNext,
  createMockUser,
  createMockTask,
  wait,
};

