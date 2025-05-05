var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweets");
const { checkBody } = require("../modules/checkBody.js");

// Afficher les tweets
router.get("/getTweets", (req, res) => {
  Tweet.find({}).then((data) => {
    data
      ? res.json({ result: true, tweets: data })
      : res.json({ result: false, error: "Error" });
  });
});

// Ecrire un tweet
router.post("/postTweet", (req, res) => {
  const body = req.body;
  // check all field is completed
  if (!checkBody(body, ["message"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const newTweet = new Tweet({
    user: body.user_id,
    message: body.message,
    hashtag: body.hashtag,
    date: new Date(),
    like: body.like,
  });
  newTweet
    .save()
    .then(() => {
      res.json({ result: true, tweet: newTweet });
    })
    .catch((err) => {
      res.json({ result: false, error: err.message });
    });
});

// Mettre à jour le like

module.exports = router;
