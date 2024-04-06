const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },
  value: {
    type: String,
  },
});

module.exports = mongoose.model("Map", mapSchema);
