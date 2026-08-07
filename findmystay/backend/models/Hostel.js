const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String
  },
  contactNumber: { type: String, required: true },
  email: String,
  hostelType: { type: String, enum: ['boys', 'girls', 'co-ed'], required: true },
  facilities: [String],
  roomTypes: [{ type: String, capacity: Number, pricePerMonth: Number, available: Number }],
  photos: [String],
  description: String,
  rules: [String],
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hostel', hostelSchema);
