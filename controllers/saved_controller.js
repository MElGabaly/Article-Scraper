// Require all models
var db = require("../models");

exports.index = function(req, res) {
  db.Article.find({ saved: true }, function(err, data) {
    const hbsObject = {
      title: "News Scraper",
      mainpage: false,
      article: data
    };
    res.render("index", hbsObject);
  });
};
