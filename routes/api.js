var express = require("express");

var router = express.Router();

var api_controller = require("../controllers/api_controller");

router.get("/scrape", api_controller.scrape);

router.get("/clear", api_controller.clear);

router.get("/clearsaved", api_controller.clearsaved);

router.delete("/headlines/:id", api_controller.deletehl);

router.put("/headlines/:id", api_controller.savehl);

router.get("/notes/:id", api_controller.findnote);

router.post("/notes", api_controller.savenote);

router.delete("/notes/:id", api_controller.deletenote);

module.exports = router;
