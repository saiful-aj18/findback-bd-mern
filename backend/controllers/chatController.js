const Message = require("../models/Message");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// @route GET /api/chat/conversations  - list distinct conversation partners
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "fullName avatar")
      .populate("receiver", "fullName avatar");

    const map = new Map();
    for (const m of messages) {
      const other = String(m.sender._id) === String(userId) ? m.receiver : m.sender;
      const key = String(other._id);
      if (!map.has(key)) {
        map.set(key, {
          user: other,
          lastMessage: m.text,
          lastTime: m.createdAt,
          unread: 0,
        });
      }
      if (String(m.receiver._id) === String(userId) && !m.read) {
        map.get(key).unread += 1;
      }
    }
    res.json({ conversations: Array.from(map.values()) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversations", error: err.message });
  }
};

// @route GET /api/chat/:userId - messages with a specific user
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

// @route POST /api/chat/:userId
exports.sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, item } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Message text is required" });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid recipient" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: userId,
      item,
      text: text.trim(),
    });

    await Notification.create({
      user: userId,
      type: "message",
      title: "New Message",
      body: `${req.user.fullName} sent you a message.`,
    });

    const populated = await message.populate("sender", "fullName avatar");
    req.io?.to(`user:${userId}`).emit("newMessage", populated);

    res.status(201).json({ message: populated });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};
