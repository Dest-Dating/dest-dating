const querystring = require("querystring");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const redirectURI = "auth/google";
const SERVER_ROOT_URI = process.env.SERVER_ROOT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const UI_ROOT_URI = process.env.UI_ROOT_URI;
const {createSendToken} = require("./authController");

function getGoogleAuthURL(type) {

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${SERVER_ROOT_URI}/user/${type === "login" ? "/questions/" : ""}${redirectURI}`,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email",].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
exports.getGoogleUrl = (req, res, next) => {
    const type = req.body.type || "login";

    return res.status(200).json({
        url: getGoogleAuthURL(type)
    });
}

function getTokens({code, clientId, clientSecret, redirectUri}) {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
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

    const {id_token, access_token} = await getTokens({
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
        return res.redirect(UI_ROOT_URI / " ");
    }

    //check if user exists

    const email = googleUser.data.email;

    let newUser = await User.create({
        email: email,
        isOAuth: true,
        phoneNumber: Math.floor(new Date().getTime() / 1000),
        password: "duck123!@#",
        passwordConfirm: "duck123!@#"
    });

    newUser = await User.findOneAndUpdate(newUser, {
        phoneNumber: null, password: null, passwordConfirm: null, isEmailVerified: true
    }, {new: true, runValidators: false});

    return createSendToken(newUser, 200, res, UI_ROOT_URI);
});
