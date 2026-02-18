const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:4001/api/hostels/${req.params.id}`);
    res.render("hostelDetails", { hostel: response.data });
  } catch (err) {
    res.send("Hostel not found.");
  }
});

module.exports = router;
