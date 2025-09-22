const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
require("./config/passport"); // Ensure you have a passport configuration file

const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend server running...");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
