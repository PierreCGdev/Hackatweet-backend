const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  message: String,
  hashtag: [String],
  date: Date,
  like: { type: Number, default: 0 },
});
const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
