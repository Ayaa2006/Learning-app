const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  dateGenerated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Certificate", certificateSchema);
