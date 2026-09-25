const express = require("express");
const router = express.Router();
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  myStats,
} = require("../controllers/itemController");
const { protect, optionalAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/stats/mine", protect, myStats);
router.get("/", optionalAuth, getItems);
router.get("/:id", getItem);
router.post("/", protect, upload.array("images", 5), createItem);
router.patch("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
