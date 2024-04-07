const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken"); //token token token babe '>'
const AppError = require("../utils/appError");
const { promisify } = require("util");
// const sendEmail = require("../utils/email");
const crypto = require("crypto");
const User = require("../models/user.model");

const querystring = require("querystring");

const redirectURI = "auth/google";

function getGoogleAuthURL() {
  const SERVER_ROOT_URI = process.env.SERVER_ROOT_URI;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
exports.getGoogleUrl = (req, res, next) => {
  return res.status(200).json({
    url: getGoogleAuthURL(),
  });
};

//todo: check for changes as we halting oauth from frontend
//todo: check for security measures when using oauth

//returns a jwt token created using given id
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//creates a jwt token using user's _id, put it into a cookie and send it as response
//ok
const createSendToken = (user, status, res) => {
  const token = signToken(user._id);

  //hide password as we are not 'selecting' user == password is still in user object
  user.password = undefined;
  user.emailVerificationOtp = undefined;

  //set cookies
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  res.cookie("jwt", token, options);

  res.status(status).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//to sing up the user
//checked normal, checked oauth
exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError("Email id not provided", 400));
  const otp = Math.floor(100000 + Math.random() * 900000);

  // check if the user already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    if (existingUser.isEmailVerified === false) {
      await User.findByIdAndDelete({ _id: existingUser.id });
    } else
      return res.status(401).json({
        status: "fail",
        message: "email id already registered",
      });
  }

  const isOAuth = req.body.isOAuth;

  //a user with dummy required credentials will be created if it is isOAuth
  //the document created will be updated to delete those fields if it is isOAuth
  let newUser = await User.create({
    email: req.body.email,
    isOAuth: isOAuth,

    phoneNumber: isOAuth ? "0000000000" : req.body.phoneNumber,
    password: isOAuth ? "duck123!@#" : req.body.password,
    passwordConfirm: isOAuth ? "duck123!@#" : req.body.passwordConfirm,
    emailVerificationOtp: !isOAuth ? otp : undefined,
  });

  //if isOAuth, update fields and then send token
  if (isOAuth) {
    newUser = await User.findOneAndUpdate(
      newUser,
      {
        phoneNumber: null,
        password: null,
        passwordConfirm: null,
        isEmailVerified: true,
      },
      { new: true, runValidators: false }
    );

    return createSendToken(newUser, 200, res);
  }

  console.log(otp);

  //todo: uncomment this=> send email
  //todo: send mail using arpit api
  //we need a key value for email
  // await sendEmail({
  //     email: newUser.email, subject: "Welcome to Duck! Please verify your email", html: `OTP: ${otp}`
  // });

  res.status(200).json({
    status: "success",
    data: {
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      isOAuth: !!isOAuth,
    },
  });
});

//checked normal, no need for oauth
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email, emailVerificationOtp, isAOth } = req.body;

  let user = null;

  if (!isAOth) {
    if (!email || !emailVerificationOtp)
      return res.status(400).json({
        status: "fail",
        message: "Please enter OTP",
      });

    user = await User.findOne({ email }).select("+emailVerificationOtp");
    if (!user)
      return res.status(406).json({
        status: "fail",
        message: "No user with this email id",
      });
    if (user.isEmailVerified)
      return res.status(200).json({
        status: "success",
        message: "user already verified",
      });
  }

  if (isAOth || user.emailVerificationOtp === emailVerificationOtp) {
    await User.updateOne(
      { email },
      { isEmailVerified: true, emailVerificationOtp: null },
      { new: true }
    );
    let updatedUser = await User.findOne({ email });
    updatedUser = { ...updatedUser }._doc;
    createSendToken(updatedUser, 201, res);
    return;
  }

  res.status(401).json({
    status: "fail",
    message: "OTP mismatch",
  });
});

//todo: check for bugs
exports.login = catchAsync(async (req, res, next) => {
  let { loginField, password } = req.body;

  //check if email and password exists => user entered these fields
  if (!loginField || !password) {
    return next(
      new AppError("Please provide phone number/email and password", 400)
    );
  }

  //check if user exists and password is correct
  //we have restricted the default selection of password, so we explicitly select password
  const filter = loginField.includes("@")
    ? { email: loginField }
    : { phoneNumber: loginField };
  let user = await User.findOne(filter).select("+password");

  //todo: i was here
  //check if user is oauth
  //if yes then check if he has password
  //if has, then try to login
  //if no,

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect phone number/email or password!", 401));

  user = { ...user }._doc;

  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res
    .cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({
      status: "success",
      message: "cookie deleted",
    });
});

//to send an email to user when he forget the password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //protected function will be called before this, so req is supposed to have user
  //get user based on posted email
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
      email: user.email,
      subject: "Reset password token. Valid for 10 min only!",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "Link to change password sent to your email!",
    });
  } catch (err) {
    //if failed to send the email, set these fields to undefined
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending you email! Please try again later!",
        500
      )
    );
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
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2. if token is not expired and there is a user then set new password
  if (!user)
    return next(
      new AppError(
        "Token is invalid or has expired. Please request a new one!",
        400
      )
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); //pre save functions will check if password and confirm password matches

  //3. updated password changed property of user
  //done in pre('save'.... middleware in userModel

  //4. log the user in, send jwt
  createSendToken(user, 200, res);
});

//user can change his password using current password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  //1. get user from the collection
  //this is only accessible after user login => req has user object
  const user = await User.findById(req.user._id).select("+password");

  //2. check if posted password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.password || "", user.password))
  ) {
    return next(new AppError("Incorrect Incorrect!", 401));
  }

  //3. update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //pre-save functions in userModel will check if password and confirm password matches

  //4. log in using new password
  createSendToken(user, 200, res);
});

//todo: below are unchecked functions
//if there is a bearer token, try to add user to the req. return otherwise
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

//makes sure that user is logged in == has a valid bearer token
//if all is good, that user is added to the req
exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  // check if there is a token
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in again.", 401)
    );
  }

  // verify the token
  //verify also accepts a callback function, but we will make it return a promise
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists => to check the case if user has jwt token but the user was deleted!
  const freshUser = await User.findOne({ _id: decoded.id });
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }

  // check if user changed password after jwt was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed their password! Please login again.",
        401
      )
    );
  }

  //grant access to the protected rout
  //also add this user to the request object
  req.user = freshUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  // check if there is a token
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in again.", 401)
    );
  }

  // verify the token
  //verify also accepts a callback function, but we will make it return a promise
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists => to check the case if user has jwt token but the user was deleted!
  const freshUser = await User.findOne({ _id: decoded.id });
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }

  // check if user changed password after jwt was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed their password! Please login again.",
        401
      )
    );
  }

  res.status(200).json({
    status: "success",
    token,
    data: {
      freshUser,
    },
  });
});
