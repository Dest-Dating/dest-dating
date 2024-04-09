const Message = require("../models/message.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cryptojs = require("crypto-js");

//Create a Message
exports.createMessage = async (req, res, next) => {
  //Creating a new Message
  const newMessage = new Message(req.body);
  try {
    //Saving the new Message to the database
    const hashedMessage = cryptojs.AES.encrypt(
      newMessage.message,
      process.env.JWT_SECRET
    ).toString();

    newMessage.message = hashedMessage;
    //Saving the Hashed message to database
    await newMessage.save({ validateBeforeSave: false });

    //Sending the resposne
    res.status(200).json("Message Sent!");
  } catch (error) {
    //Error Handling
    // console.log(error);
    res.status(500).json(error);
  }
};

//Get the Messages
exports.getMessages = catchAsync(async (req, res, next) => {
  try {
    //Finding the conversation messsages using the conversation id
    const hashedMessages = await Message.find({
      conversationId: req.params.userId,
    });
    //Decrypting the message
    const messages = await Promise.all(
      hashedMessages.map(async (messageObj) => {
        const unhashedMessage = cryptojs.AES.decrypt(
          messageObj.message,
          process.env.JWT_SECRET
        ).toString(cryptojs.enc.Utf8);
        messageObj.message = unhashedMessage;
        return messageObj;
      })
    ).then((res) => res);

    //Sending back the resposne
    res.status(200).json(messages);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});
