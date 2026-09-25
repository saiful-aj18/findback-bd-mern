const User = require("../models/User");
const Item = require("../models/Item");

// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [users, items, lost, found, matched, flagged] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ type: "lost" }),
      Item.countDocuments({ type: "found" }),
      Item.countDocuments({ status: "Matched" }),
      Item.countDocuments({ isFlagged: true }),
    ]);
    res.json({ users, items, lost, found, matched, flagged });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// @route PATCH /api/admin/users/:id/ban
exports.toggleBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// @route GET /api/admin/reports
exports.getReports = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "fullName email").sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports", error: err.message });
  }
};

// @route PATCH /api/admin/reports/:id/flag
exports.toggleFlag = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Report not found" });
    item.isFlagged = !item.isFlagged;
    await item.save();
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: "Failed to update report", error: err.message });
  }
};

// @route DELETE /api/admin/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Report not found" });
    await item.deleteOne();
    res.json({ message: "Report removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete report", error: err.message });
  }
};
