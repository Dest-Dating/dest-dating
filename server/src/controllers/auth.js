const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendMail = require("../utils/mailSender");
const randomStringGenerator = require("../utils/randomString");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if all fields are provided
    if (!name || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    // check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isEmailVerified == false) {
        await User.findByIdAndDelete({ _id: existingUser.id });
      } else
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
    }

    // hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    // Generate random string
    const randomString = randomStringGenerator(5);

    // Send Email to user
    await sendMail(
      email,
      "Welcome to bit2byte",
      `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-size: cover;
            color: #fff;
            padding: 20px;
          }
          .container {
            background-image: url("https://windowscustomization.com/wp-content/uploads/2018/10/cyberpunk-night-city.gif");
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #f0f0f0;
            padding: 10px;
            border-radius: 10px;
            background-color: rgb(27, 26, 26);
          }
          p {
            padding: 5px;
            border-radius: 5px;
            width: fit-content;
            background-color: black;
            color: #ccc;
            line-height: 1.6;
          }
          .code {
            padding: 10px;
            margin-top: 30px;
            margin-bottom: 30px;
            background-color: black;
            border-radius: 5px;
            border-radius: 5px;
            font-size: 1.2em;
            margin-top: 20px;
            color: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome, <span style="color: rgb(74, 74, 236)">${name} </span></h1>
          <p>Thank you for joining our platform.</p>
          <div class="code">
            Your verification code is: <br /><b style="color: rgb(74, 74, 236)"
              >${randomString}</b
            >
          </div>
        </div>
      </body>
    </html> 
      `
    );

    // create new user entry
    let user = await User.create({
      name,
      email,
      password: hashedPassword,
      code: randomString,
    })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: "User creation success",
        });
      })
      .catch(() => {
        return res.status(401).json({
          success: false,
          message: "FAILED. User not created",
        });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    // check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    const payload = {
      id: user._id,
    };

    // create jwt token for the user with 30 days of access
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      };

      res.cookie("jwt", token, options);

      return res.status(200).json({
        success: true,
        user,
        jwt_token: token,
        message: "User logged in successfully",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Email or password is incorrect",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure",
    });
  }
};

// Verify Email
exports.verification = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not registered",
      });
    }

    // console.log(user);
    // console.log(`${user.code} <> ${code}`);
    if (user.code == code) {
      await User.updateOne({ email }, { isEmailVerified: true });
      return res.status(200).json({
        success: true,
        message: "Email verified",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Error occurred while verifying Email",
      });
    }
  } catch (err) {
    console.log("EMAIL NOT VERIFIED");
    return res.status(401).json({
      success: false,
      message: "Error occurred while verifying Email",
    });
  }
};
