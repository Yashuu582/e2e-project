const express = require("express");
const router = express.Router();

router.use("/create-profile", require("./pages/CreateProfile"));
router.use("/matches", require("./pages/MatchList"));
router.use("/requests", require("./pages/Requests"));

module.exports = router;
