const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("createProfile", { message: null });
});

router.post("/", async (req, res) => {
  try {
    const { name, age, gender, preferences, email } = req.body;
    await axios.post("http://localhost:4002/api/roommates/create", { name, age, gender, preferences, email });
    res.render("createProfile", { message: "Profile created successfully!" });
  } catch (err) {
    res.render("createProfile", { message: err.response?.data?.message || "Error creating profile" });
  }
});

module.exports = router;
