const prisma = require("../../db");
const { buildUser } = require("./userFactory");

function mockUserExists(overrides = {}) {
  const user = buildUser(overrides);

  prisma.user.findUnique.mockResolvedValue(user);
  prisma.user.update.mockResolvedValue(user);
  prisma.user.delete.mockResolvedValue(user);

  return user;
}

function mockUserNotFound() {
  prisma.user.findUnique.mockResolvedValue(null);
}

module.exports = {
  mockUserExists,
  mockUserNotFound,
};
