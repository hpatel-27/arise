const prisma = require("../db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const achievementService = require("./achievementService");

async function register(email, password) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });
  return user;
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("This email is not registered. Please sign up.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password. Please try again.");

  const { newStreak, isSameDay } = computeStreak(user.lastLogin, user.loginStreak);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), loginStreak: newStreak },
  });

  // Only update streak achievements when the streak actually changed
  const streakUnlocks = isSameDay
    ? []
    : await achievementService.updateStreakAchievements(user.id, newStreak);

  const loginUnlocks = await achievementService.updateAchievementsForAction(
    user.id,
    "login"
  );

  return {
    token: generateToken(user.id),
    unlockedAchievements: [...streakUnlocks, ...loginUnlocks],
  };
}

// Computes the new login streak value and whether this is a same-day login.
// Exported so passport.js can reuse the same logic without duplication.
function computeStreak(lastLogin, currentStreak) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!lastLogin) {
    return { newStreak: 1, isSameDay: false };
  }

  const lastDay = new Date(
    lastLogin.getFullYear(),
    lastLogin.getMonth(),
    lastLogin.getDate()
  );
  const dayDiff = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) return { newStreak: currentStreak, isSameDay: true };
  if (dayDiff === 1) return { newStreak: currentStreak + 1, isSameDay: false };
  return { newStreak: 1, isSameDay: false }; // streak broken
}

module.exports = { register, login, computeStreak };
