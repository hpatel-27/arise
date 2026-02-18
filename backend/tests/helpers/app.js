require("dotenv").config();
const express = require("express");
const passport = require("passport");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(passport.initialize());

  const API_PREFIX = "/v1";
  require("../../routes")(app, API_PREFIX);

  return app;
}

module.exports = { createApp };
