const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["lost", "found"], required: true },
    category: {
      type: String,
      enum: ["Mobile", "Bag", "Wallet", "Keys", "Documents", "Electronics", "Clothes", "Others"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    location: {
      address: { type: String, default: "" },
      lat: { type: Number },
      lng: { type: Number },
    },
    status: { type: String, enum: ["Open", "Matched", "Resolved"], default: "Open" },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

itemSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Item", itemSchema);
