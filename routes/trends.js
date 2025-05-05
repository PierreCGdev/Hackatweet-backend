var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweets");

// Afficher les trends
router.get("/getTrends", (req, res) => {
  Tweet.find({}, "hashtag").then((trends) => {
    if (trends) {
      const filterTrends = trends.filter((item) => {
        return item.hashtag && item.hashtag.length > 0;
      });
      res.json({ result: true, trends: filterTrends });
    } else {
      res.json({ result: false, error: "Error trends not found" });
    }
  });
});

module.exports = router;
