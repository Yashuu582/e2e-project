const express = require("express");
const router = express.Router();

router.use("/add-hostel", require("./pages/AddHostel"));
router.use("/hostels", require("./pages/HostelList"));
router.use("/hostel", require("./pages/HostelDetails"));

module.exports = router;
