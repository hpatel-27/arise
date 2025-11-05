require("dotenv").config({ debug: true });
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const API_PREFIX = process.env.API_PREFIX;

// routes
const authRoutes = require("./routes/auth");
app.use(`${API_PREFIX}/auth`, authRoutes);

const userRoutes = require("./routes/user");
app.use(`${API_PREFIX}`, userRoutes);

const achievementRoutes = require("./routes/achievements");
app.use(`${API_PREFIX}`, achievementRoutes);

const categoryRoutes = require("./routes/categories");
app.use(`${API_PREFIX}`, categoryRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
