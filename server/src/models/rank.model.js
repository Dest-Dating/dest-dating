const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  data: {
    type: Number,
  },
  height: {
    type: Number,
    default: 1,
  },
  leftNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rank",
  },
  rightNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rank",
  },
});

module.exports = mongoose.model("Rank", rankSchema);
