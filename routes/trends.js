var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweets");

// Afficher les trends
router.get("/getTrends", (req, res) => {
  Tweet.find({}, "hashtag").then((trends) => {
    trends
      ? res.json({ result: true, trends: trends })
      : res.json({ result: false, error: "Error trends not found" });
  });
});

module.exports = router;
