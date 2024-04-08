const express = require("express");
const messageController = require("./../controllers/messageController");
const router = express.Router();

//Create a Message
router.post("/", messageController.createMessage);
//Get the Messages
router.get("/:userId", messageController.getMessages);

module.exports = router;
