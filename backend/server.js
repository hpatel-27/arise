require("dotenv").config();
const cors = require("cors");
const express = require("express");
const API_PREFIX = process.env.API_PREFIX;

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes

// Register them all
require("./routes")(app, API_PREFIX);

// Start the server on given port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
