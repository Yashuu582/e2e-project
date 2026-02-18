const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5003/api/admin/users");
    res.render("manageUsers", { users: response.data });
  } catch (err) {
    res.render("manageUsers", { users: [], message: "Error loading users" });
  }
});

module.exports = router;
