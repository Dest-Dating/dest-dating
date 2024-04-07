const User = require("../models/user.model");

// Controller function to like a user
exports.likeUser = async (req, res) => {
  try {
    const userEmailToLike = req.body.email;
    const currentUser = req.user;

    console.log("currentUser", currentUser);

    // Check if the user exists and is not the current user
    const userToLike = await User.findOne({ email: userEmailToLike });
    if (!userToLike || userToLike._id.equals(currentUser._id)) {
      return res
        .status(404)
        .json({ message: "User not found or cannot like yourself" });
    }

    // Check if the user is already liked
    if (currentUser.likedArray.includes(userToLike._id)) {
      return res.status(400).json({ message: "User already liked" });
    }

    // Add the liked user to the current user's likedArray
    currentUser.likedArray.push(userToLike._id);
    await currentUser.save({ validateBeforeSave: false });

    // Check if the liked user also likes the current user (matched)
    if (userToLike.likedArray.includes(currentUser._id)) {
      // If matched, update both users' matchedArray
      currentUser.matchedArray.push(userToLike._id);
      userToLike.matchedArray.push(currentUser._id);
      await Promise.all([currentUser.save(), userToLike.save()]);
    }

    res.status(200).json({ message: "User liked successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to like the user",
      error,
    });
  }
};

// Controller function to reject a user
exports.rejectUser = async (req, res) => {
  try {
    const userEmailToReject = req.body.email;
    const currentUser = req.user;

    // Check if the user exists and is not the current user
    const userToReject = await User.findOne({ email: userEmailToReject });
    if (!userToReject || userToReject._id.equals(currentUser._id)) {
      return res
        .status(404)
        .json({ message: "User not found or cannot reject yourself" });
    }

    // Check if the user is already rejected
    if (currentUser.rejectedArray.includes(userToReject._id)) {
      return res.status(400).json({ message: "User already rejected" });
    }

    // Add the rejected user to the current user's rejectedArray
    currentUser.rejectedArray.push(userToReject._id);
    await currentUser.save({ validateBeforeSave: false });

    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to reject the user",
      error,
    });
  }
};
