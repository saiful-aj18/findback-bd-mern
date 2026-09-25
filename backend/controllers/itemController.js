const Item = require("../models/Item");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @route POST /api/items
exports.createItem = async (req, res) => {
  try {
    const { type, category, name, description, address, lat, lng } = req.body;
    if (!type || !category || !name || !description) {
      return res.status(400).json({ message: "type, category, name and description are required" });
    }
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const item = await Item.create({
      user: req.user._id,
      type,
      category,
      name,
      description,
      images,
      location: { address: address || "", lat: lat || undefined, lng: lng || undefined },
    });

    // naive auto-match: same category, opposite type, still open
    const oppositeType = type === "lost" ? "found" : "lost";
    const matches = await Item.find({
      category,
      type: oppositeType,
      status: "Open",
      $text: { $search: name },
    }).limit(5).catch(() => []);

    if (matches && matches.length) {
      await Notification.create({
        user: req.user._id,
        type: "match",
        title: "Possible Match Found",
        body: `Your ${type} item may match a ${oppositeType} report.`,
        relatedItem: matches[0]._id,
      });
    }

    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: "Failed to create report", error: err.message });
  }
};

// @route GET /api/items  (search & filter, with pagination)
exports.getItems = async (req, res) => {
  try {
    const { q, type, category, status, sort = "newest", page = 1, limit = 20, mine } = req.query;
    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (category && category !== "all") filter.category = category;
    if (status && status !== "all") filter.status = status;
    if (q) filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
    if (mine && req.user) filter.user = req.user._id;

    const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 } };
    const items = await Item.find(filter)
      .populate("user", "fullName avatar phone email")
      .sort(sortMap[sort] || sortMap.newest)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Item.countDocuments(filter);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
};

// @route GET /api/items/:id
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "fullName avatar phone email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch item", error: err.message });
  }
};

// @route PATCH /api/items/:id
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this report" });
    }
    const allowed = ["name", "description", "category", "status", "type"];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) item[k] = req.body[k];
    });
    await item.save();

    if (req.body.status) {
      await Notification.create({
        user: item.user,
        type: "status",
        title: "Report Status Updated",
        body: `Your report status changed to ${req.body.status}.`,
        relatedItem: item._id,
      });
    }

    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: "Failed to update item", error: err.message });
  }
};

// @route DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this report" });
    }
    await item.deleteOne();
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
};

// @route GET /api/items/stats/mine
exports.myStats = async (req, res) => {
  try {
    const reports = await Item.countDocuments({ user: req.user._id });
    const matches = await Item.countDocuments({ user: req.user._id, status: "Matched" });
    const user = await User.findById(req.user._id);
    res.json({ reports, matches, rating: user.rating || 0, ratingCount: user.ratingCount || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
