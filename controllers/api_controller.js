var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

exports.scrape = function(req, res) {
  axios
    .get("https://business.financialpost.com/author/bloombergnp")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      $("article").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element)
          .find("header > h4 > a")
          .text();
        result.link = $(element)
          .find("header >  h4 > a")
          .attr("href");
        result.summary = $(element)
          .find(
            "div.entry-content.gallery-details > div.gallery-excerpt > div.entry-content.gallery-mobile-excerpt"
          )
          .text();

        if (result.title !== "" && result.summary !== "") {
          db.Article.findOne({ title: result.title }, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              if (data === null) {
                db.Article.create(result)
                  .then(function(dbArticle) {
                    console.log(dbArticle);
                  })
                  .catch(function(err) {
                    // If an error occurred, send it to the client
                    console.log(err);
                  });
              }
            }
          });
        }
      });
      // Send a message to the client
      db.Article.find({})
        .then(function(dbArticle) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
};

exports.deletehl = function(req, res) {
  db.Article.deleteOne({ _id: req.params.id }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      return res.send(true);
    }
  });
};

exports.savehl = function(req, res) {
  var saved = req.body.saved == "true";
  if (saved) {
    db.Article.updateOne(
      { _id: req.body._id },
      { $set: { saved: true } },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          return res.send(true);
        }
      }
    );
  }
};

exports.findnote = function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle.note);
    })
    .catch(function(err) {
      res.json(err);
    });
};

exports.savenote = function(req, res) {
  console.log(req.body);
  db.Note.create({ noteText: req.body.noteText })
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.body._headlineId },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
};

exports.deletenote = function(req, res) {
  db.Note.deleteOne({ _id: req.params.id }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      return res.send(true);
    }
  });
};

exports.clear = function(req, res) {
  // Grab every document in the Articles collection
  db.Article.deleteMany({ saved: { $in: false } }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(true);
    }
  });
};

exports.clearsaved = function(req, res) {
  var criteria = {
    saved: { $in: true }
  };
  db.Article.update(criteria, { saved: false }, { multi: true }, function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
    } else {
      return res.send(true);
    }
  });
};
