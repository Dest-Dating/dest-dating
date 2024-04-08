const Conversations = require("../models/conversation.model");
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
