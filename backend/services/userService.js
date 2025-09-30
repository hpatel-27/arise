import prisma from "../db";

async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });
  //   if (!users) throw new Error("No users found");
  return users;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}

async function deleteUser(id) {
  const user = await prisma.user.delete({
    where: { id },
    select: { id: true, email: true },
  });

  if (!user) throw new Error("User not found");
  // return the user that was deleted
  return user;
}

async function updateUser(id, data) {}

module.exports = { getAllUsers, getUserById, deleteUser, updateUser };
