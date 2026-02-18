const Roommate = require("../models/Roommate");

// Create roommate profile
exports.createProfile = async (req, res) => {
  try {
    const { name, age, gender, preferences, email } = req.body;
    const existing = await Roommate.findOne({ email });
    if (existing) return res.status(400).json({ message: "Profile already exists" });

    const roommate = new Roommate({ name, age, gender, preferences, email });
    await roommate.save();
    res.json(roommate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all matches
exports.getMatches = async (req, res) => {
  try {
    const matches = await Roommate.find();
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get requests by email (for simplicity, we just return all profiles except this email)
exports.getRequests = async (req, res) => {
  try {
    const { email } = req.query;
    const requests = await Roommate.find({ email: { $ne: email } });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
