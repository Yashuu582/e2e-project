const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER USER (example)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET ALL USERS FROM MONGODB
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log(users); // see data in terminal
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
