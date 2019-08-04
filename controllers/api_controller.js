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
              console.log(data);
            }
          });
        }
        // Create a new Article using the `result` object built from scraping
        // db.Article.create(result)
        //   .then(function(dbArticle) {
        //     // View the added result in the console
        //   })
        //   .catch(function(err) {
        //     // If an error occurred, log it
        //     console.log(err);
        //   });
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

exports.deletehl = function(req, res) {
  console.log("reqbody:" + JSON.stringify(req.params.id));
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
  // res.send(true)
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle.note);
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
      console.log("dbNote:" + dbNote);
      return db.Article.findOneAndUpdate(
        { _id: req.body._headlineId },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      console.log("dbArticle:" + dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
};

exports.deletenote = function(req, res) {
  console.log("reqbody:" + JSON.stringify(req.params.id));
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
  console.log(req.body);

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
