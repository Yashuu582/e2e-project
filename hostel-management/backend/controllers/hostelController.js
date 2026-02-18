const Hostel = require("../models/Hostel");

// Add new hostel
exports.addHostel = async (req, res) => {
  try {
    const { name, location, rooms, pricePerMonth, description } = req.body;
    const hostel = new Hostel({ name, location, rooms, pricePerMonth, description });
    await hostel.save();
    res.json(hostel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// List all hostels
exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get hostel by ID
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });
    res.json(hostel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
