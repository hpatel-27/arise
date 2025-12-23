// Export routes to provide routing access to the server
module.exports = (app, API_PREFIX) => {
  // Authentication routes
  app.use(`${API_PREFIX}/auth`, require("./auth"));

  // User routes
  app.use(`${API_PREFIX}/users`, require("./users"));

  // Achievement routes
  app.use(`${API_PREFIX}/achievements`, require("./achievements"));

  // Category routes
  app.use(`${API_PREFIX}/categories`, require("./categories"));

  // Task routes
  app.use(`${API_PREFIX}/tasks`, require("./tasks"));

  // Stat routes
  app.use(`${API_PREFIX}/stats`, require("./stats"));

  // User Task routes
  app.use(`${API_PREFIX}/userTasks`, require("./userTasks"));
};
