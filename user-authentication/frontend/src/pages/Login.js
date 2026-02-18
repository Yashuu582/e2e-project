const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { navbar: res.locals.navbar, message: null });
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post("http://localhost:4000/api/auth/login", { email, password });

    // Store token in HTTP-only cookie
    const token = response.data.token;
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "strict"
    });

    // Redirect to dashboard page after login
    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { navbar: res.locals.navbar, message: err.response?.data?.message || "Error" });
  }
});

module.exports = router;
