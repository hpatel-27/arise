function buildUser(overrides = {}) {
  return {
    id: "user-123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  };
}

module.exports = { buildUser };
