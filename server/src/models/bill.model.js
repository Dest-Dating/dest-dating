const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age:{
      type: Number,
      required: true
    },
    email:{
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword:{
      type: String,
      required: true,
    },
    phoneNumber:{
      type: Number
    },
    height: {
      type: Number,
      required: true,
    },
    gender:{
      type: String,
      enum: ["Male", "Female", "NonBinary"],
      required: true,
    },
    interestedInGender: {
      type: String,
      enum: ["Male", "Female", "NonBinary"],
      required: true,
    },
    location: [
      {
        type: Number,
      },
    ],
    rejectedArray: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likedArray: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matchedArray: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chatArray: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    mainProfilePhotoLink:{
      type: String
    },
    photosLink: [
      {
        type: String,
      },
    ],
    passwordConfirmed:{
      type: String,
      required: true,
    },
    passwordChangedAt:{
      type: Date,
    },
    passwordResetToken:{
      type: String
    },
    passwordResetExpires:{
      type: Number,
    },
    otp: {
      type: Number,
    },
    isEmailVerified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bill", userSchema);
