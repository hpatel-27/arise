const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../db");
const statService = require("../services/statService");
const achievementService = require("../services/achievementService");
const { computeStreak } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile info: ", profile);
        // check if user exists
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // create user
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value || null,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
            },
          });

          // Initialize stats for new user
          await statService.initializeStats(user.id);
        }

        const { newStreak, isSameDay } = computeStreak(user.lastLogin, user.loginStreak);

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date(), loginStreak: newStreak },
        });

        const streakUnlocks = isSameDay
          ? []
          : await achievementService.updateStreakAchievements(user.id, newStreak);

        const loginUnlocks = await achievementService.updateAchievementsForAction(
          user.id,
          "login"
        );

        const token = generateToken(user.id);
        return done(null, {
          user,
          token,
          unlockedAchievements: [...streakUnlocks, ...loginUnlocks],
        });
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
