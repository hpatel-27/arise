const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("../config/passport");

// User registration and login
router.post("/register", authController.register);
router.post("/login", authController.login);

// Google OAuth Login
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Google OAuth callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   authController.googleCallback
// );

module.exports = router;
