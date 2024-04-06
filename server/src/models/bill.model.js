const mongoose = require("mongoose");

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
      type: Integer
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

module.exports = mongoose.model("Bill", userSchema);
