const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  contactNumber: String,
  email: String,
  hostelType: String,
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hostel', hostelSchema);
