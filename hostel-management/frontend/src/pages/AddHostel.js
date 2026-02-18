const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("addHostel", { message: null });
});

router.post("/", async (req, res) => {
  try {
    const { name, location, rooms, pricePerMonth, description } = req.body;
    await axios.post("http://localhost:4001/api/hostels", { name, location, rooms, pricePerMonth, description });
    res.render("addHostel", { message: "Hostel added successfully!" });
  } catch (err) {
    res.render("addHostel", { message: "Error adding hostel." });
  }
});

module.exports = router;
