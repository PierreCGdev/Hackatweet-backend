var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweets");

// Afficher les trends
router.get("/all", (req, res) => {
  Tweet.find({}, "hashtag").then((trends) => {
    if (trends) {
      const filterTrends = [];
      trends.map((item) => {
        filterTrends.push(...item.hashtag);
      });
      let newObj = {};
      for (let item of filterTrends) {
        if (!newObj[item]) {
          newObj[item] = 1;
        } else {
          newObj[item] += 1;
        }
      }
      const newArray = [];
      for (let item in newObj) {
        newArray.push({ hastag: item, numberTweet: newObj[item] });
      }
      res.json({ result: true, trends: newArray });
    } else {
      res.json({ result: false, error: "Error trends not found" });
    }
  });
});

module.exports = router;
