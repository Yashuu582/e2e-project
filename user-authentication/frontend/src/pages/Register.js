const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register", { navbar: res.locals.navbar, message: null });
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Send POST request to backend
    const response = await axios.post("http://localhost:4000/api/auth/register", { name, email, password });

    // Store JWT token in cookie
    const token = response.data.token;
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });

    // Redirect after successful signup
    res.redirect("/dashboard");
  } catch (err) {
    res.render("register", { navbar: res.locals.navbar, message: err.response?.data?.message || "Error" });
  }
});

module.exports = router;
