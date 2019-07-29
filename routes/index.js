var express = require("express");

var router = express.Router();

var index_controller = require("../controllers/index_controller");

router.get("/", index_controller.index);

router.get("/scrape", index_controller.scrape);

router.get("/articles", index_controller.articles);

module.exports = router;
