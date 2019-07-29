var express = require("express");
var router = express.Router();
var Content = require("../models/content");

/* GET home page. */
router.get("/", function(req, res, next) {
  Content.find(function(err, content) {
    const hbsObject = {
      title: "Saved",
      mainpage: false,
      contents: content
    };
    res.render("index", hbsObject);
  });
});

module.exports = router;
