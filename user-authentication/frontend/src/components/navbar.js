const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navbar = `
    <nav>
      <a href="/login">Login</a> |
      <a href="/register">Register</a>
    </nav>
    <hr/>
  `;
  next();
});

module.exports = router;
