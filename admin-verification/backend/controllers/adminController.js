const mongoose = require("mongoose");

// Using the Hostel and User models (assume already exist in other modules)
const Hostel = require("../../hostel-management/backend/models/Hostel");
const User = require("../../user-authentication/backend/models/User");

// Get all hostels for verification
exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Verify hostel
exports.verifyHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const hostel = await Hostel.findByIdAndUpdate(id, { verified: true }, { new: true });
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Reject hostel
exports.rejectHostel = async (req, res) => {
  try {
    const { id } = req.params;
    await Hostel.findByIdAndDelete(id);
    res.json({ message: "Hostel rejected and deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
