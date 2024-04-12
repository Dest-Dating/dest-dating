const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken"); //token token token babe '>'
const AppError = require("../utils/appError");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../models/user.model");
const axios = require("axios");
const sendEmail = require("../utils/email");

//todo: login using oauth
//todo: check for changes as we halting oauth from frontend
//todo: check for security measures when using oauth

//returns a jwt token created using given id
//checked normal, checked oauth
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//creates a jwt token using user's _id, put it into a cookie and send it as response
//checked normal, checked oauth
const createSendToken = async (user, status, res, req, redirect) => {
  const token = signToken(user._id);

  //hide password as we are not 'selecting' user == password is still in user object
  user.password = undefined;
  user.emailVerificationOtp = undefined;

  //set cookies
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true,
  };
  res.cookie("jwt", token, options);


  //updating leetcode data upon login
  const updatingUrl = `${req.protocol}://${req.get("host")}/user/fetchLeetcodeData`;
  let response;
  try {
    response = await axios.create({ withCredentials: true }).post(updatingUrl, req.body, {
      headers: {
        Cookie: "jwt=" + token,
      },
    });

    if (response.status === 200) {
      user = response.data.data.user;
    }
  } catch (e) {
    console.log("crap");
    //pass
  }

  if (redirect) {
    res.redirect(redirect);
  }

  res.status(status).json({
    status: "success", token, data: {
      user,
    },
  });
};

//to sing up the user
//this is not for oauth user. oauth user are signed up using functions defined in aouthController.google.js
//checked normal. not meant for oauth
exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError("Email id not provided", 400));
  const otp = Math.floor(100000 + Math.random() * 900000);

  // check if the user already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    if (existingUser.isEmailVerified === false) {
      await User.findByIdAndDelete({ _id: existingUser.id });
    } else return res.status(401).json({
      status: "fail", message: "email id already registered",
    });
  }

  //a user with dummy required credentials will be created if it is isOAuth
  //the document created will be updated to delete those fields if it is isOAuth
  let newUser = await User.create({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    emailVerificationOtp: otp,
  });

  console.log(otp);

  await sendEmail({
    email: newUser.email, subject: "OTP for Dest!", message: `Your OTP for email verification is \n ${otp}.`
  });

  res.status(200).json({
    status: "success", data: {
      phoneNumber: newUser.phoneNumber, email: newUser.email, isOAuth: false, otp,
    },
  });
});

//checked normal, not meant for oauth
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email, emailVerificationOtp } = req.body;

  let user = null;

  if (!email || !emailVerificationOtp) return res.status(400).json({
    status: "fail", message: "Please enter OTP",
  });

  user = await User.findOne({ email }).select("+emailVerificationOtp");
  if (!user) return res.status(406).json({
    status: "fail", message: "No user with this email id",
  });
  if (user.isEmailVerified) return res.status(200).json({
    status: "success", message: "user already verified",
  });

  if (user.emailVerificationOtp === emailVerificationOtp) {
    await User.updateOne({ email }, { isEmailVerified: true, emailVerificationOtp: null }, { new: true });
    let updatedUser = await User.findOne({ email });
    updatedUser = { ...updatedUser }._doc;
    await sendEmail({
      email: user.email, subject: "Welcome to Dest!", message: `Dear user,\nWelcome to Dest. Your Registration is successfull.`
    });
    await createSendToken(updatedUser, 201, res, req);
    return;
  }

  res.status(401).json({
    status: "fail", message: "OTP mismatch",
  });
});

//todo: do oauth login

//to login the user
//for normal login
exports.login = catchAsync(async (req, res, next) => {
  let { loginField, password } = req.body;

  if (!loginField) return next(new AppError("Please provide phone number/email and password", 400));

  const filter = loginField.includes("@") ? { email: loginField } : { phoneNumber: loginField };

  //check if user exists and password is correct
  //we have restricted the default selection of password, so we explicitly select password
  let user = await User.findOne(filter).select("+password");
  if (!user) return next(new AppError("Incorrect phone number/email or password!", 401));

  if (user.isOAuth && !user.password) return next(new AppError("Please login using OAuth.", 403));

  if (!password) {
    return next(new AppError("Please provide phone number/email and password", 400));
  }

  if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError("Incorrect phone number/email or password!", 401));


  // user = { ...user }._doc;

  await createSendToken(user, 200, res, req);
});

//checked normal
exports.logout = catchAsync(async (req, res, next) => {
  res
    .cookie("jwt", "", {
      httpOnly: true, expires: new Date(0),
    })
    .json({
      status: "success", message: "cookie deleted",
    });
});

//checked
//makes sure that user is logged in == has a valid bearer token
//if all is good, that user is added to the req
exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  // check if there is a token
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in again.", 401));
  }

  // verify the token
  //verify also accepts a callback function, but we will make it return a promise
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists => to check the case if user has jwt token but the user was deleted!
  const freshUser = await User.findOne({ _id: decoded.id });
  if (!freshUser) {
    return next(new AppError("The user belonging to this token does not exist.", 401));
  }

  // check if user changed password after jwt was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed their password! Please login again.", 401));
  }

  //grant access to the protected rout
  //also add this user to the request object
  req.user = freshUser;
  next();
});

//return user if logged in, relevant error messages otherwise
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  // check if there is a token
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in again.", 401));
  }

  // verify the token
  //verify also accepts a callback function, but we will make it return a promise
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists => to check the case if user has jwt token but the user was deleted!
  const freshUser = await User.findOne({ _id: decoded.id }).populate("subscriptions");
  if (!freshUser) {
    return next(new AppError("The user belonging to this token does not exist.", 401));
  }

  // check if user changed password after jwt was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed their password! Please login again.", 401));
  }

  res.status(200).json({
    status: "success", token, data: {
      user: freshUser,
    },
  });
});

//todo: below functions are not checked on postman yet
//to send an email to user when he forget the password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  //link is the link of client page
  const link = req.body.link;
  if (!user) {
    return next(new AppError("No user with that email address.", 404));
  }
  if (!link) {
    return next(new AppError("Link to send not provided!", 400));
  }

  //generate token
  const resetToken = user.createPasswordResetToken();
  //validation is set false because few fields such as password and confirm password is not provided by the user
  //so save without validation
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetUrl = `${link}/resetpassword/${resetToken}`;

  //todo: create a nice html to send to user on email
  const message = `Forgot password? neeche wale link ko open krdo:\n
     ${resetUrl}\n\nPlease ignore this message if you didn't forgot the password!.`;

  try {
    await sendEmail({
      email: user.email, subject: "Reset password token. Valid for 10 min only!", message: message,
    });

    res.status(200).json({
      status: "success", message: "Link to change password sent to your email!",
    });
  } catch (err) {
    //if failed to send the email, set these fields to undefined
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an error sending you email! Please try again later!", 500));
  }
});

//to reset the password after user forgot it
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. get user based on token
  //we stored hashed resetToken in database, so hash the resetToken that user gave to compare
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //get user based on the resetToken and also make sure that token is not expired yet
  const user = await User.findOne({
    passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() },
  });

  //2. if token is not expired and there is a user then set new password
  if (!user) return next(new AppError("Token is invalid or has expired. Please request a new one!", 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); //pre save functions will check if password and confirm password matches

  //3. updated password changed property of user
  //done in pre('save'.... middleware in userModel

  //4. log the user in, send jwt
  await createSendToken(user, 200, res, req);
});

//user can change his password using current password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  //1. get user from the collection
  //this is only accessible after user login => req has user object
  const user = await User.findById(req.user._id).select("+password");

  //2. check if posted password is correct
  if (!user || !(await user.correctPassword(req.body.password || "", user.password))) {
    return next(new AppError("Incorrect Incorrect!", 401));
  }

  //3. update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //pre-save functions in userModel will check if password and confirm password matches

  //4. log in using new password
  await createSendToken(user, 200, res, req);
});

//todo: might be deleted if not used in feature
//if there is a bearer token, try to add user to the req. do nothing otherwise
exports.addUserToRequest = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    next();
    return;
  }

  // verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists => to check the case if user has jwt token but the user was deleted!
  const freshUser = await User.findOne({ _id: decoded.id });
  if (!freshUser || freshUser.changePasswordAfter(decoded.iat)) {
    next();
    return;
  }
  //also add this user to the request object
  req.user = freshUser;
  next();
};
