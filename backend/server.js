require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const API_PREFIX = process.env.API_PREFIX;

// Routes

// Authentication routes
const authRoutes = require("./routes/auth");
app.use(`${API_PREFIX}/auth`, authRoutes);

// User routes
const userRoutes = require("./routes/users");
app.use(`${API_PREFIX}`, userRoutes);

// Achievement routes
const achievementRoutes = require("./routes/achievements");
app.use(`${API_PREFIX}`, achievementRoutes);

// Category Routes
const categoryRoutes = require("./routes/categories");
app.use(`${API_PREFIX}`, categoryRoutes);

// Task routes
const taskRoutes = require("./routes/tasks");
app.use(`${API_PREFIX}`, taskRoutes);

// Stat routes
const statRoutes = require("./routes/stats");
app.use(`${API_PREFIX}`, statRoutes);

// User Task routes
const userTaskRoutes = require("./routes/userTasks");
app.use(`${API_PREFIX}`, userTaskRoutes);

// Start the server on given port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
