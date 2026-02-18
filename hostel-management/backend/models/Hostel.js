const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rooms: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hostel", HostelSchema);
