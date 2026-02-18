const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5003/api/admin/hostels");
    res.render("verifyHostels", { hostels: response.data });
  } catch (err) {
    res.render("verifyHostels", { hostels: [], message: "Error loading hostels" });
  }
});

module.exports = router;
