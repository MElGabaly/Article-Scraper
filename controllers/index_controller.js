var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

exports.index = function(req, res) {
  const hbsObject = {
    title: "News Scraper",
    mainpage: true
  };
  res.render("index", hbsObject);
};

exports.scrape = function(req, res) {
  axios
    .get("https://business.financialpost.com/author/bloombergnp")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("h4.gallery-title").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.summary = $(this)
          .children("a")
          .text();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      // Send a message to the client
      db.Article.find({})
        .then(function(dbArticle) {
          // If we were able to successfully find Articles, send them back to the client
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
};

exports.articles = function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
};
