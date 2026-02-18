const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:4002/api/roommates/matches");
    res.render("matchList", { matches: response.data });
  } catch (err) {
    res.render("matchList", { matches: [], message: "Error loading matches" });
  }
});

module.exports = router;
