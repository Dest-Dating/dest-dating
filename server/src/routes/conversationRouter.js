const express = require("express");
const conversationController = require("../controllers/conversationController");
const router = express.Router();

router.post("/", conversationController.newConversation);
router.get("/:userId", conversationController.getConversation);
router.post("/convoUsers", conversationController.getConvoUsers);
module.exports = router;
