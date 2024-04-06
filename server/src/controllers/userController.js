const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const AppError = require("../utils/appError");

exports.test = (req, res, next) => {
    res.status(200).json({
        status: "success", message: "test completed"
    })
}

exports.updateUserDetails = catchAsync(async (req, res, next) => {
    const user = req.user;

    const dob = new Date(req.body.dob);
    const currentDate = new Date();
    const diff = currentDate - dob;
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18 || age > 100) return next(new AppError("Invalid age", 400));

    const updates = {
        dob: dob,
        name: req.body.name || user.name,
        height: req.body.height || user.height,
        gender: req.body.gender || user.gender,
        interestedInGender: req.body.interestedInGender || user.interestedInGender, //todo: location ?,
        mainProfilePhotoLink: req.body.mainProfilePhotoLink || user.mainProfilePhotoLink,
        photosLink: req.body.photosLink || user.photosLink
    }

    const updatedUser = await User.findOneAndUpdate(user, updates, {new: true});

    res.status(200).json({
        status: "success", user: updatedUser
    });
});

