function userDTO(user) {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
  };
}

module.exports = { userDTO };
