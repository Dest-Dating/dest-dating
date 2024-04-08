const express = require("express");
const conversationController = require("./../controllers/conversationController");
const router = express.Router();

router.post("/", conversationController.newConversation);
router.get("/:userId", conversationController.getConversation);

module.exports = router;
