var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function(dbArticles) {
        res.json(dbArticles);
      }).catch (function(err) {
        res.json(err);
      })
  });

  // Scrapes the cnet website
  app.get("/scrape", function(req, res) {
    axios.get("https://www.cnet.com/news/").then(function(response) {
      var $ = cheerio.load(response.data);
  
      $(".col-5.assetText").each(function(i, element) {
        var result = {};
        result.title = $(this).children("h3").text().trim();
        result.link = "http://www.cnet.com" + $(this).children("h3").children("a").attr("href");
        result.summary = $(this).children("p").text().trim();

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scrape complete.");
    })
  })

  app.post("/api/notes/:id", function(req, res) {
    db.Article.findOneAndUpdate(
      {_id: req.params.id},
      {saved: true},
      {new: true})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  })

  app.delete("/api/notes/:id", function(req, res) {
    db.Article.findOneAndDelete(
      {_id: req.params.id}
    ).then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
  })
  
}