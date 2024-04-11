const mongoose = require("mongoose");

//todo: add validations

const billSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate:{
      type: Date
    },
    endDate:{
      type: Date
    },
    amount:{
      type: Number
    },
    transactionId:{
      type: String
    },
    billingAddress:{
      type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bill", billSchema);
