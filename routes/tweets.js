var express = require("express");
var router = express.Router();
const moment = require("moment");

require("../models/connection");
const Tweet = require("../models/tweets");
const { checkBody } = require("../modules/checkBody.js");
// Afficher les tweets
router.get("/getTweets", (req, res) => {
  Tweet.find()
    .populate("user_id", "firstname username")
    .then((data) => {
      const nowUtc = moment();
      const newData = data.map((element) => {
        const itemDate = moment(element.date);
        element.countdown = itemDate.from(nowUtc);
        return {
          ...element.toObject(),
          countdown: itemDate.from(nowUtc),
        };
      });
      data
        ? res.json({ result: true, tweets: newData })
        : res.json({ result: false, error: "Error tweets not finds" });
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
    user_id: body.user_id,
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
router.put("/like", (req, res) => {
  if (!checkBody(req.body, ["tweetId", "userId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const tweetId = req.body.tweetId;
  const userId = req.body.userId;
  Tweet.findOne({ _id: tweetId }).then((data) => {
    if (!data) {
      return res.json({ result: false, error: "Tweet not found" });
    }
    if (data.likes.includes(userId)) {
      data.likes = data.likes.filter((e) => e.toString() !== userId.toString());
    } else {
      data.likes.push(userId);
    }
    data.save().then((updatedTweet) => {
      res.json({ result: true, tweet: updatedTweet });
    });
  });
});

// Supprimer un message
router.delete("/deleteTweet/:id", (req, res) => {
  const tweetId = req.params.id;

  Tweet.findByIdAndDelete(tweetId).then((tweet) => {
    if (!tweet) {
      return res.json({ result: false, error: "Tweet not found" });
    }
    res.json({ result: true, message: "Tweet deleted" });
  });
});

module.exports = router;
