const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  toggleBan,
  getReports,
  toggleFlag,
  deleteReport,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);
router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/ban", toggleBan);
router.get("/reports", getReports);
router.patch("/reports/:id/flag", toggleFlag);
router.delete("/reports/:id", deleteReport);

module.exports = router;
