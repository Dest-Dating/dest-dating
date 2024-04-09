const Conversations = require("../models/conversation.model");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//New Conversation
exports.newConversation = catchAsync(async (req, res, next) => {
  //Creating the new conversation
  const newConversation = new Conversations({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    //Saving new Conversation to the database
    const saveConversation = await newConversation.save();

    //Sending the response
    res.status(200).json(saveConversation);
  } catch (error) {
    //error handling
    res.status(500).json(error);
  }
});

//Get the Conversations of a User
exports.getConversation = catchAsync(async (req, res, next) => {
  try {
    //Finding the conversation including the current user using it's id
    const conversation = await Conversations.find({
      members: { $in: [req.params.userId] },
    });

    //Sending the resposne
    res.status(200).json(conversation);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//Get conversation users details
exports.getConvoUsers = async (req, res, next) => {
  try {
    const userList = req.body.data.filter((user) => user !== null);
    const detailedUserList = await Promise.all(
      userList.map(async (userId) => {
        const user = await User.findById(userId);
        return {
          userId: user._id,
          name: user.name,
          profilePicture: user.photosLink[0],
        };
      })
    ).then((value) => value);
    //Sending back the response
    res.status(200).json(detailedUserList);
  } catch (error) {
    //Error Handling
    res.status(500).json(error.message);
  }
};
