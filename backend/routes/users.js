const express = require("express");
const router = express.Router();
const { updateProfile, changePassword, getPublicProfile } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.patch("/me", protect, upload.single("avatar"), updateProfile);
router.patch("/me/password", protect, changePassword);
router.get("/:id", getPublicProfile);

module.exports = router;
