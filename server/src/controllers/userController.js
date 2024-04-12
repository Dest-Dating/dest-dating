const User = require("../models/user.model");
const Bill = require("../models/bill.model");
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
    fieldsOfInterests: req.body.fieldsOfInterests || user.fieldsOfInterests,
  };

  const updatedUser = await User.findOneAndUpdate(user._id, updates, {
    new: true,
  });

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

  //adding this session id to user
  user.sessionIds.push(session.id);
  await user.save({ validateBeforeSave: false });

  res.json({ id: session.id });
});

exports.validateSubscription = catchAsync(async (req, res, next) => {
  const user = req.user;
  const lastId = user.sessionIds.slice(-1)[0];

  if (!lastId) return next(new AppError("No session id found.", 404));

  const session = await stripe.checkout.sessions.retrieve(lastId);

  console.log(session);

  if (session.payment_status === "paid") {
    const lastSubscription = await Bill.findById(user.subscriptions.slice(-1)[0]);
    //todo: extract to a function
    //add subscription upon success
    let startDate = new Date();
    if (lastSubscription?.endDate && lastSubscription.endDate >= startDate) {
      startDate = new Date(lastSubscription.endDate);
      startDate.setDate(startDate.getDate() + 1);
    }
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 29);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);

    const bill = await Bill.create({
      subscriber: user._id, startDate, endDate, amount: 599, //todo get it from session status!
      transactionId: "_dummy_transaction_id_", billingAddress: "_dummy_billing_address_",
    });

    user.subscriptions.push(bill);
    user.sessionIds.pop(); //remove the last session id
    await user.save({ validateBeforeSave: false });
  }

  res.send({
    status: "success", data: {
      paymentStatus: session.payment_status, user,
    },
  });
});


//coding platform data extraction
//function to make graphQl request for leetcode graphql
async function getLeetcodeGraphqlResponse(query, variables) {
  let data = JSON.stringify({
    query: query, variables: variables,
  });

  let config = {
    method: "post", url: "https://leetcode.com/graphql/", headers: { "Content-Type": "application/json" }, data: data,
  };

  return axios(config);
}


//function to fetch leetcode details
exports.fetchLeetcodeData = catchAsync(async (req, res, next) => {
  let user = req.user;
  const username = req.body.leetcodeUsername || user.leetcodeData.leetcodeUsername;

  if (!username) {
    return next(new AppError("Dont have leetcode username.", 400));
  }

  //fetch if there is a new username
  //fetch if last fetch was 5 hours ago or more
  if (username === user.leetcodeData.leetcodeUsername && (user.leetcodeData?.updatedAt && Math.abs(new Date() - user.leetcodeData.updatedAt) < 5 * 60 * 60 * 1000)) {
    res.status(425).json({
      status: "success", message: "Data was recently updated. Try again later.", data: {
        user: user,
      },
    });
    return;
  }

  let query = `
        query userPublicProfile($username: String!, $year: Int ) {
          matchedUser(username: $username) {
            profile {
              ranking
              userAvatar
            }
            submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
            userCalendar(year: $year) {
              streak
            }
            languageProblemCount {
              languageName
            }
          }
        }
    `;
  let response = await getLeetcodeGraphqlResponse(query, { username });

  console.log(response.data);

  if (!response.data.data.matchedUser) {
    res.status(400).json({
      status: "fail", message: "No such user found on leetcode!",
    });
  }

  const rank = response.data.data.matchedUser?.profile?.ranking || 0;
  const streak = response.data.data.matchedUser?.userCalendar?.streak || 0;
  let languagesUsed = response.data.data.matchedUser?.languageProblemCount?.map(language => language.languageName) || [];
  const submissionCount = response.data.data.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];


  user.rank = rank;
  user.leetcodeData = {
    leetcodeUsername: username, updatedAt: new Date(), streak: streak, submissionCount: submissionCount,
  };

  languagesUsed = languagesUsed.filter((l) => !user.codingLanguage?.includes(l));
  user.codingLanguage = [...user.codingLanguage, ...languagesUsed];

  let year = new Date().getFullYear();
  query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          submissionCalendar
        }
      }
    }
    `;

  response = await getLeetcodeGraphqlResponse(query, { username, year });
  if (!response.data.data.matchedUser) {
    res.status(400).json({
      status: "fail", message: response.data.errors[0].message,
    });
    return;
  }

  user.leetcodeData.heatmap = JSON.parse(response.data.data?.matchedUser?.userCalendar?.submissionCalendar) || [];

  user = await user.save({ validateBeforeSave: false, new: true });


  res.status(200).json({
    status: "success", data: {
      user,
    },
  });

});

exports.setLocation = catchAsync(async (req, res, next) => {
  const user = req.user;
  const coordinates = req.body.location.coordinates;

  const newUser = await User.findById(user._id);
  newUser.location.type = "Point";
  newUser.location.coordinates = coordinates;
  await newUser.save({ validateBeforeSave: false });
  res.send({
    status: "success", data: {
      user: newUser,
    },
  });
});
