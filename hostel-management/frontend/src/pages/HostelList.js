const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:4001/api/hostels");
    res.render("hostelList", { hostels: response.data });
  } catch (err) {
    res.render("hostelList", { hostels: [], message: "Error loading hostels." });
  }
});

module.exports = router;
