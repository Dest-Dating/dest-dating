const mongoose = require("mongoose");

const ageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    data:{
      type: Integer,
    },
    leftNode:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    rightNode:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  },
);

module.exports = mongoose.model("Age", ageSchema);
