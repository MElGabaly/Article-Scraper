module.exports = function(app) {
  const index = require("./routes/index");
  const saved = require("./routes/saved");
  const api = require("./routes/api");

  app.use("/", index);
  app.use("/saved", saved);
  app.use("/api", api);
};
