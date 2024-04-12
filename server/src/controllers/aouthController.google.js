const querystring = require("querystring");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redirectURI = "auth/google";
const SERVER_ROOT_URI = process.env.SERVER_ROOT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const UI_ROOT_URI = process.env.UI_ROOT_URI;
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

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
  console.log("Ahhhhhhhhhhh", updatingUrl);
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
    console.log("sent redirect ", redirect);
    return res.redirect(redirect);
  }

  res.status(status).json({
    status: "success", token, data: {
      user,
    },
  });
};

function getGoogleAuthURLSignup() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/user/${redirectURI}`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
  };
  return `${rootUrl}?${querystring.stringify(options)}`;
}


// Getting login URL
exports.getGoogleUrl = (req, res, next) => {
  return res.status(200).json({
    url: getGoogleAuthURLSignup(),
  });
};

function getTokens({ code, clientId, clientSecret, redirectUri }) {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code",
  };

  return axios.post(url, querystring.stringify(values), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}

// Getting the user from Google with the code
exports.authGoogle = catchAsync(async (req, res, next) => {

  const code = req.query.code;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${SERVER_ROOT_URI}/user/${redirectURI}`,
  });

  // Fetch the user's profile with the access token and bearer
  let googleUser = null;
  try {
    googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
  } catch (e) {
    console.log("Google API ERRORED! 😐😐😐😐😐");
    console.log(e);
    return res.redirect(UI_ROOT_URI / " ");
  }

  const email = googleUser.data.email;
  //if there is such a user, return its jwt
  let newUser = await User.findOne({ email });

  if (!newUser) {
    console.log("Creating new user by oAuth");
    newUser = await User.create({
      email: email,
      isOAuth: true,
      phoneNumber: Math.floor(new Date().getTime()),
      password: "duck123!@#",
      passwordConfirm: "duck123!@#",
    });


    newUser = await User.findOneAndUpdate(newUser, {
      $unset: { password: "", passwordConfirm: "" }, isEmailVerified: true,
    }, { new: true, runValidators: false });

    await sendEmail({
      email: newUser.email,
      subject: "Welcome to Dest!",
      message: `Dear ${newUser.name},\nWelcome to Dest. Your Registration is successfull.`,
    });

  } else {
    console.log("OAuth user found in DB");
  }

  return createSendToken(newUser, 200, res, req, UI_ROOT_URI + "/authComplete");
});

