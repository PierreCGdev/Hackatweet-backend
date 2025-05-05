var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const uid2 = require("uid2");
const { checkBody } = require("../modules/checkBody.js");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.post("/signup", (req, res) => {
  const body = req.body;
  // check all field is completed
  if (!checkBody(body, ["firstname", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ username: body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(body.password, 10);

      const newUser = new User({
        firstname: body.firstname,
        username: body.username,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((newDoc) => {
        res.json({
          result: true,
          token: newDoc.token,
          firstname: newDoc.firstname,
          username: newDoc.username,
          id: newDoc._id,
          tweet_id: newDoc.tweet_id,
        });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  const body = req.body;
  // check all field is completed
  if (!checkBody(body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ username: body.username }).then((data) => {
    if (data && bcrypt.compareSync(body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        firstname: data.firstname,
        username: data.username,
        id: data._id,
        tweet_id: data.tweet_id,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

module.exports = router;
