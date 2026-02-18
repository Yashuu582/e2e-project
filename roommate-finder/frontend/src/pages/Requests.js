const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5002/api/roommates/requests", { params: { email: "" } });
    res.render("requests", { requests: response.data });
  } catch (err) {
    res.render("requests", { requests: [], message: "Error loading requests" });
  }
});

module.exports = router;
