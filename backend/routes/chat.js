const express = require("express");
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/conversations", getConversations);
router.get("/:userId", getMessages);
router.post("/:userId", sendMessage);

module.exports = router;
