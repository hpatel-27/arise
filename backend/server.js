require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");

// const passport = require("passport");
// require("./config/passport"); // Ensure you have a passport configuration file

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
// app.use(passport.initialize());

// routes
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
