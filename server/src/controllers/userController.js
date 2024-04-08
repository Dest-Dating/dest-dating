const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const AppError = require("../utils/appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.test = (req, res, next) => {
  res.status(200).json({
    status: "success", message: "test completed",
  });
};

exports.updateUserDetails = catchAsync(async (req, res, next) => {
  const user = req.user;

  const dob = new Date(req.body.dob);
  const currentDate = new Date();
  const diff = currentDate - dob;
  const ageDate = new Date(diff);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 18 || age > 100) return next(new AppError("under/over aged", 400));

  const updates = {
    dob: dob,
    name: req.body.name || user.name,
    height: req.body.height || user.height,
    gender: req.body.gender || user.gender,
    interestedInGender: req.body.interestedInGender || user.interestedInGender, //todo: location ?,
    //todo: automate this
    isSignupCompleted: req.body.isSignupCompleted || true,
  };

  const updatedUser = await User.findOneAndUpdate(user._id, updates, { new: true });

  res.status(200).json({
    status: "success", user: updatedUser,
  });
});

exports.updateProfilePick = catchAsync(async (req, res, next) => {
  let user = req.user;
  const profileImage = req.body.profileImage;

  if (!profileImage) return next(new AppError("Image url not provided!", 400));

  user.mainProfilePhotoLink = profileImage;

  user = await user.save({ new: true, validateBeforeSave: false });

  res.status(200).json({
    status: "success", data: {
      user,
    },
  });
});

exports.addPhotoLink = catchAsync(async (req, res, next) => {
  let user = req.user;
  const photoLink = req.body.photoLink;
  const index = req.body.index;

  if (!photoLink || typeof index != "number") return next(new AppError("Photo Link not provided.", 400));

  user.photosLink = user.photosLink.filter((obj) => obj.index !== index);
  user.photosLink = user.photosLink.push({ photoLink, index });
  user = await user.save({ new: true, validateBeforeSave: false });

  res.status(200).json({
    status: "success", data: {
      user,
    },
  });
});

exports.deletePhotoLink = catchAsync(async (req, res, next) => {
  let user = req.user;
  const photoLink = req.body.photoLink;

  if (!photoLink) return next(new AppError("Photo Link not provided.", 400));

  user.photosLink = user.photosLink.filter((link) => link.photoLink !== photoLink);
  user = await user.save({ new: true, validateBeforeSave: false });

  res.status(200).json({
    status: "success", data: {
      user,
    },
  });
});

exports.buySubscription = catchAsync(async (req, res, next) => {
  const user = req.user;

  const lineItems = [{
    price_data: {
      currency: "inr", product_data: {
        name: "Dest Premium Membership",
      }, unit_amount: 599 * 100,
    }, quantity: 1,
  }];
  //
  // const lineItems = products.map((product) => ({
  //   price_data: {
  //     currency: "inr", product_data: {
  //       name: product.dish, images: [product.imgdata],
  //     }, unit_amount: product.price * 100,
  //   }, quantity: product.qnty,
  // }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/paymentSuccess",
    cancel_url: "http://localhost:3000/paymentFailed",
  });


  console.log(session.id);
  res.json({ id: session.id });
});


// Controller to set user preferences
// exports.setUserPreferences = async (req, res) => {
//   try {
//     const { minAge, maxAge, minHeight, maxHeight } = req.body;
//
//     // Check if the user exists
//     const user = req.user;
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//
//     // Update user preferences
//     if (minAge) user.preferences.minAge = minAge; // add for age in recommendation Algo
//     if (maxAge) user.preferences.maxAge = maxAge;
//     if (minHeight) user.preferences.minHeight = minHeight;
//     if (maxHeight) user.preferences.maxHeight = maxHeight;
//
//     // Save updated preferences
//     await user.save({ validateBeforeSave: false });
//
//     res.status(200).json({
//         status: "success", data: {
//             user
//         }
//     })
//
// });
