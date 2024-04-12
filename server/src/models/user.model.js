const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator"); //provides various schema validators
const bcryptjs = require("bcryptjs");
const { type } = require("os");
const { Mongoose } = require("mongoose");

//todo: select only if user if verified

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [this.isEmailVerified, "A user must have a username"],
      minLength: [5, "name too short(min=5)!"],
      maxLength: [15, "name too long(max=15)!"],
    },
    dob: {
      type: Date,
      required: [this.isEmailVerified, "A user must have a date of birth"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is must!"],
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    password: {
      type: String,
      required: [!this.isOAuth, "Please create a password!"],
      minlength: 8,
      select: false, //do not select this ever
    },
    phoneNumber: {
      type: Number,
      required: !this.isOAuth,
      unique: true,
    },
    height: {
      type: Number,
      required: this.isEmailVerified,
      min: 54,
      max: 275,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "NonBinary"],
        message: "Invalid gender",
      },
      required: this.isEmailVerified,
    },
    interestedInGender: {
      type: String,
      enum: {
        values: ["Male", "Female", "NonBinary"],
        message: "Invalid gender",
      },
      required: this.isEmailVerified,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    bills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bills",
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
    mainProfilePhotoLink: {
      type: String,
      required: [this.isEmailVerified, "User must have a profile image"],
    },
    photosLink: [
      {
        index: Number,
        photoLink: String,
      },
    ],
    passwordConfirm: {
      type: String,
      required: [!this.isOAuth, "Please confirm the password!"],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Number,
    emailVerificationOtp: {
      type: String,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    rank: {
      type: Number, //todo: unique ??
    },
    leetcodeData: {
      leetcodeUsername: String,
      updatedAt: Date,
      streak: Number,
      submissionCount: {},
      heatmap: mongoose.Schema.Types.Mixed,
    },
    isOAuth: {
      type: Boolean,
      default: false,
    }, // preferences
    preferences: {
      type: [String],
      default: [],
    },
    isSignupCompleted: {
      type: Boolean,
      default: false,
    },
    sessionIds: [
      {
        type: String,
      },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        autopopulate: true,
      },
    ],
    bio: String,
    fieldsOfInterests: [{ type: String }],
    codingLanguage: [{ type: String }],
  },
  {
    timestamps: true,
  },
);
userSchema.plugin(require("mongoose-autopopulate"));

function calculateAge(birthDateObj) {
  const today = new Date();

  console.log("called");

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  return age;
}

//before saving, encrypt the password and remove confirm password
userSchema.pre("save", async function(next) {
  // no need to do this every time, do only when password in modified
  if (!this.isModified("password")) return next();
  //encrypt the password
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined; //don't save this in the database
  next();
});

//method to check the password
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword,
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

//returns true if token was created BEFORE change in password
userSchema.methods.changePasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10,
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

//modify passwordChangedAt when password is changed
userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();
  //sometimes saving to database is slow
  // , so ... decreasing 10 second so it not to create any problem while logging in using token
  this.passwordChangedAt = Date.now() - 10000;
  next();
});

//creates a reset password token to
userSchema.methods.createPasswordResetToken = function() {
  //we cant simply store resetToken as it is into the database due to security issues
  const resetToken = crypto.randomBytes(32).toString("hex");

  //we will store the hashed token instead
  //we will send this original resetToken to user on email
  //when user will give us this token, we will hash this token and compare it with the one stored in the database

  //the next line will update the resetToken
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //valid for 10 minutes

  //we have not 'saved' this user document yet, that will be done in the resetPassword function
  //that is supposed to call createPasswordResetToken
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
