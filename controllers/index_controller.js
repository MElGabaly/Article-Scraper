// Require all models
var db = require("../models");

exports.index = function(req, res) {
  db.Article.find({ saved: false }, function(err, data) {
    const hbsObject = {
      title: "News Scraper",
      mainpage: true,
      article: data
    };
    res.render("index", hbsObject);
  });
};
