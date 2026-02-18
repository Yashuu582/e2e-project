const express = require("express");
const router = express.Router();

router.use("/dashboard", require("./pages/Dashboard"));
router.use("/verify-hostels", require("./pages/VerifyHostels"));
router.use("/manage-users", require("./pages/ManageUsers"));

module.exports = router;
