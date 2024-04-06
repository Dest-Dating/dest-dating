const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Map = require("../models/map.model");
const Rank = require("../models/rank.model");
const { default: mongoose } = require("mongoose");

function getHeight(root) {
  if (root == "null") return 0;
  return root.height;
}

exports.addUser = async (req, res) => {
  try {
    let { key, email } = req.body;
    let user = await User.findOne({ email });
    let rootDoc = await Map.findOne({ key: "root" });

    // First Entry
    if (!rootDoc.value) {
      const node = await Rank.create({
        userId: user._id,
        data: parseInt(key),
      }).then(async () => {
        await Map.create({ key: "root", value: key }).then(() => {
          console.log("done");
        });
      });

      return res.status(200).json({
        success: true,
      });
    }

    let root = await User.findById({
      _id: mongoose.Types.ObjectId(rootDoc.value),
    });
  } catch (error) {
    console.log(error);
  }
};
