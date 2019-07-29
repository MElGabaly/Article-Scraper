module.exports = function(app) {
  const index = require("./routes/index");
  const saved = require("./routes/saved");

  app.use("/", index);
  app.use("/saved", saved);
};
