const prisma = require("../db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { response } = require("express");

async function register(email, password) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return response.status(409).json({ message: "Email already in use" });

  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, password: hashedPassword },
  });
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return response.json({ message: "Invalid email or password" });

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) return response.json({ message: "Invalid email or password" });

  return generateToken(user.id);
}

module.exports = { register, login };
