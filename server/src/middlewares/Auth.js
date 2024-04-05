const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
require("dotenv").config();

// authenticates the user with the provided token
exports.auth = async (req, res, next) => {
  console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user || !req.user.isEmailVerified) {
        return res.status.json(466).json({
          success: false,
          message: "Email Not verified",
        });
      }
      req.id = decoded.id;
      next();
    } catch (error) {
      console.log(error);
      return res.status(488).json({
        success: false,
        message: "Not Authorized",
      });
    }
  } else {
    return res.status(499).json({
      success: false,
      message: "Token not found",
    });
  }
};
