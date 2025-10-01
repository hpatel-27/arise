require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();

const passport = require("passport");
require("./config/passport"); // Ensure you have a passport configuration file

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

const API_PREFIX = process.env.API_PREFIX;

// routes
const authRoutes = require("./routes/auth");
app.use(`${API_PREFIX}/auth`, authRoutes);

const userRoutes = require("./routes/user");
app.use(`${API_PREFIX}`, userRoutes);

const achievementRoutes = require("./routes/achievements");
app.use(`${API_PREFIX}`, achievementRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
