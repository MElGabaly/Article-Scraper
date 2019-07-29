var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

exports.index = function(req, res) {
  const hbsObject = {
    title: "News Scraper",
    mainpage: false
  };
  res.render("index", hbsObject);
};
